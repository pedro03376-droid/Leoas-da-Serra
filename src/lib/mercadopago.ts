import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Integracao com o Mercado Pago Checkout Pro: criamos uma "preferencia"
 * (pagina de pagamento hospedada por eles, com Pix/cartao/boleto prontos)
 * e recebemos um webhook quando o pagamento e aprovado. O pedido e o
 * estoque continuam 100% no nosso banco (Supabase) -- o Mercado Pago so
 * processa o pagamento em si, do mesmo jeito que qualquer checkout
 * proprio precisa de um gateway por tras.
 */

const MP_API_URL = "https://api.mercadopago.com";

interface ItemPreferencia {
  titulo: string;
  quantidade: number;
  precoUnitCentavos: number;
}

export function mercadoPagoConfigurado(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

export async function criarPreferencia(params: {
  pedidoId: string;
  itens: ItemPreferencia[];
  emailComprador: string;
  urlBase: string;
}): Promise<{ id: string; initPoint: string }> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN ausente.");

  const resposta = await fetch(`${MP_API_URL}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // Evita que uma tentativa de reenvio (timeout/retry) crie 2 preferencias pro mesmo pedido.
      "X-Idempotency-Key": params.pedidoId,
    },
    body: JSON.stringify({
      items: params.itens.map((item) => ({
        title: item.titulo,
        quantity: item.quantidade,
        currency_id: "BRL",
        unit_price: item.precoUnitCentavos / 100,
      })),
      payer: { email: params.emailComprador },
      external_reference: params.pedidoId,
      notification_url: `${params.urlBase}/api/webhooks/mercadopago`,
      back_urls: {
        success: `${params.urlBase}/loja/checkout/retorno?status=success`,
        failure: `${params.urlBase}/loja/checkout/retorno?status=failure`,
        pending: `${params.urlBase}/loja/checkout/retorno?status=pending`,
      },
      auto_return: "approved",
    }),
  });

  if (!resposta.ok) {
    throw new Error(`Mercado Pago recusou a preferencia (${resposta.status}): ${await resposta.text()}`);
  }

  const dados = (await resposta.json()) as { id: string; init_point: string };
  return { id: dados.id, initPoint: dados.init_point };
}

export interface PagamentoMP {
  id: number;
  status: string;
  external_reference: string | null;
}

export async function buscarPagamento(paymentId: string): Promise<PagamentoMP> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN ausente.");

  const resposta = await fetch(`${MP_API_URL}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) throw new Error(`Falha ao buscar pagamento ${paymentId} (${resposta.status}).`);
  return (await resposta.json()) as PagamentoMP;
}

/**
 * Confirma que a notificacao realmente veio do Mercado Pago (e nao de
 * alguem chamando o endpoint na mao pra forjar um pedido pago), seguindo o
 * esquema deles: HMAC-SHA256 de "id:{dataId};request-id:{requestId};ts:{ts};"
 * usando o secret do webhook, comparado ao valor "v1" do header x-signature.
 */
export function validarAssinaturaWebhook(params: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
}): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret || !params.xSignature) return false;

  const partes = Object.fromEntries(
    params.xSignature.split(",").map((parte) => {
      const [chave, valor] = parte.split("=");
      return [chave?.trim(), valor?.trim()];
    }),
  );
  const ts = partes.ts;
  const v1 = partes.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${params.dataId};request-id:${params.xRequestId ?? ""};ts:${ts};`;
  const assinaturaEsperada = createHmac("sha256", secret).update(manifest).digest("hex");

  const bufferEsperado = Buffer.from(assinaturaEsperada, "hex");
  const bufferRecebido = Buffer.from(v1, "hex");
  if (bufferEsperado.length !== bufferRecebido.length) return false;
  return timingSafeEqual(bufferEsperado, bufferRecebido);
}
