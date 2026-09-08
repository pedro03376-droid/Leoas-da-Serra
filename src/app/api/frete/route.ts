import { NextResponse } from "next/server";

/**
 * Estimativa de frete via API do Melhor Envio (agregador com contrato
 * proprio junto aos Correios/transportadoras — a API direta dos Correios
 * exige contrato Pessoa Juridica desde out/2023, que o clube nao tem).
 *
 * IMPORTANTE: isto e so uma ESTIMATIVA mostrada na pagina do produto pra
 * ajudar a decisao de compra. O frete que realmente conta e o que a
 * Nuvemshop calcula no checkout dela mesma (com o peso/dimensoes ja
 * cadastrados la) — nao substituimos isso, so damos um preview.
 *
 * Token e obtido em https://melhorenvio.com.br (ou .sandbox. pra testes)
 * em "Gerenciar > Tokens de integracao" e fica so no servidor (nunca em
 * NEXT_PUBLIC_*, senao qualquer visitante consegue ver e usar o token).
 */

const MELHOR_ENVIO_BASE_URL = process.env.MELHOR_ENVIO_SANDBOX === "true" ? "https://sandbox.melhorenvio.com.br" : "https://melhorenvio.com.br";

// CEP central de Lages - SC (sede do clube), usado como origem do calculo
// de frete enquanto MELHOR_ENVIO_CEP_ORIGEM nao for setado com o CEP exato
// de onde as encomendas saem de verdade.
const CEP_ORIGEM_PADRAO = "88501-000";

interface PacoteRequisicao {
  pesoKg: number;
  alturaCm: number;
  larguraCm: number;
  comprimentoCm: number;
  quantidade: number;
  precoCentavos: number;
}

interface CotacaoMelhorEnvio {
  id: number;
  name: string;
  price?: string;
  custom_price?: string;
  delivery_time?: number;
  custom_delivery_time?: number;
  company?: { name?: string };
  error?: string;
}

export async function POST(request: Request) {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const cepOrigem = process.env.MELHOR_ENVIO_CEP_ORIGEM || CEP_ORIGEM_PADRAO;

  if (!token) {
    return NextResponse.json({ erro: "Calculo de frete nao configurado." }, { status: 503 });
  }

  const body = (await request.json()) as { cepDestino?: string; pacote?: PacoteRequisicao };
  const cepDestino = body.cepDestino?.replace(/\D/g, "");
  const pacote = body.pacote;

  if (!cepDestino || cepDestino.length !== 8 || !pacote) {
    return NextResponse.json({ erro: "CEP invalido." }, { status: 400 });
  }

  const resposta = await fetch(`${MELHOR_ENVIO_BASE_URL}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Leoas da Serra (contato@leoasdaserra.com.br)",
    },
    body: JSON.stringify({
      from: { postal_code: cepOrigem },
      to: { postal_code: cepDestino },
      products: [
        {
          id: "camisa",
          width: pacote.larguraCm,
          height: pacote.alturaCm,
          length: pacote.comprimentoCm,
          weight: pacote.pesoKg,
          insurance_value: pacote.precoCentavos / 100,
          quantity: pacote.quantidade,
        },
      ],
    }),
  });

  if (!resposta.ok) {
    return NextResponse.json({ erro: "Nao foi possivel calcular o frete agora." }, { status: 502 });
  }

  const cotacoes = (await resposta.json()) as CotacaoMelhorEnvio[];

  const opcoes = cotacoes
    .filter((cotacao) => !cotacao.error && (cotacao.custom_price ?? cotacao.price))
    .map((cotacao) => ({
      transportadora: cotacao.company?.name ?? "",
      servico: cotacao.name,
      precoCentavos: Math.round(Number(cotacao.custom_price ?? cotacao.price) * 100),
      prazoDias: cotacao.custom_delivery_time ?? cotacao.delivery_time ?? null,
    }));

  return NextResponse.json({ opcoes });
}
