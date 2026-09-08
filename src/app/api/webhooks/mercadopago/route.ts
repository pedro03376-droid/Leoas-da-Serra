import { NextResponse } from "next/server";
import { buscarPagamento, validarAssinaturaWebhook } from "@/lib/mercadopago";
import { supabaseServidor } from "@/lib/supabase";

/**
 * Recebe a notificacao do Mercado Pago quando um pagamento muda de status.
 * So aqui (nunca na volta do navegador pro back_url) e que confiamos que
 * um pagamento foi aprovado -- o back_url e so pra UX, pode ser fechado
 * ou nunca carregar e o pedido ainda assim tem que ser processado.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => null)) as { type?: string; data?: { id?: string } } | null;

  const tipo = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = body?.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");

  // Outros tipos de evento (merchant_order etc.) sao confirmados sem acao.
  if (tipo !== "payment" || !dataId) {
    return NextResponse.json({ ok: true });
  }

  const assinaturaValida = validarAssinaturaWebhook({
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId,
  });
  if (!assinaturaValida) {
    return NextResponse.json({ erro: "Assinatura invalida." }, { status: 401 });
  }

  const pagamento = await buscarPagamento(dataId);
  const pedidoId = pagamento.external_reference;
  if (!pedidoId) return NextResponse.json({ ok: true });

  const supabase = supabaseServidor();

  const { data: pedido } = await supabase.from("pedidos").select("id, status").eq("id", pedidoId).maybeSingle();
  if (!pedido) return NextResponse.json({ ok: true });

  // Idempotente: o Mercado Pago pode reenviar a mesma notificacao varias vezes.
  if (pedido.status === "pago" || pedido.status === "pago_sem_estoque") {
    return NextResponse.json({ ok: true });
  }

  if (pagamento.status !== "approved") {
    await supabase.from("pedidos").update({ status: pagamento.status, mp_payment_id: String(pagamento.id) }).eq("id", pedidoId);
    return NextResponse.json({ ok: true });
  }

  const { data: itens } = await supabase.from("pedido_itens").select("produto_id, tamanho, quantidade").eq("pedido_id", pedidoId);

  let estoqueOk = true;
  for (const item of itens ?? []) {
    const { data: baixou } = await supabase.rpc("baixar_estoque", {
      p_produto_id: item.produto_id,
      p_tamanho: item.tamanho ?? "",
      p_quantidade: item.quantidade,
    });
    if (!baixou) estoqueOk = false;
  }

  // Mesmo sem estoque suficiente o pagamento ja foi aprovado (dinheiro
  // recebido) -- marca pra conferencia manual em vez de perder o pedido.
  await supabase
    .from("pedidos")
    .update({ status: estoqueOk ? "pago" : "pago_sem_estoque", mp_payment_id: String(pagamento.id) })
    .eq("id", pedidoId);

  return NextResponse.json({ ok: true });
}
