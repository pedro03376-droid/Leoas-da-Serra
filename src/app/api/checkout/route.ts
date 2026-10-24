import { NextResponse } from "next/server";
import { getProdutosDestaque } from "@/lib/content";
import { criarPreferencia, mercadoPagoConfigurado } from "@/lib/mercadopago";
import { supabaseConfigurado, supabaseServidor } from "@/lib/supabase";

interface ItemRequisicao {
  produtoId: string;
  tamanho?: string;
  quantidade: number;
}

interface ChekoutRequisicao {
  nome: string;
  email: string;
  telefone?: string;
  cep?: string;
  endereco?: Record<string, string>;
  itens: ItemRequisicao[];
}

// Limites generosos so pra barrar lixo/abuso obvio, nao pra validar o
// formato de verdade (isso fica pro Mercado Pago e pro proprio clube
// conferir no pedido).
const TAMANHO_MAXIMO_TEXTO = 200;
const QUANTIDADE_MAXIMA_POR_ITEM = 20;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textoSeguro(valor: string | undefined, maximo: number): string | null {
  const limpo = valor?.trim().slice(0, maximo);
  return limpo || null;
}

function urlBaseDe(): string {
  // So a env var, nunca os headers Origin/Host da requisicao -- esses sao
  // controlados por quem chama o endpoint, e essa URL vira o
  // notification_url que o Mercado Pago usa pra avisar pagamento aprovado.
  // Se um atacante conseguisse forjar esse valor, o aviso de pagamento
  // (e a baixa de estoque) iria pro dominio dele, nao pro nosso.
  const configurada = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configurada) throw new Error("NEXT_PUBLIC_SITE_URL nao configurada.");
  return configurada.replace(/\/$/, "");
}

export async function POST(request: Request) {
  if (!supabaseConfigurado() || !mercadoPagoConfigurado()) {
    return NextResponse.json({ erro: "Checkout proprio ainda nao configurado." }, { status: 503 });
  }

  let urlBase: string;
  try {
    urlBase = urlBaseDe();
  } catch {
    return NextResponse.json({ erro: "Checkout proprio ainda nao configurado." }, { status: 503 });
  }

  const body = (await request.json()) as ChekoutRequisicao;

  const nome = textoSeguro(body.nome, TAMANHO_MAXIMO_TEXTO);
  const email = textoSeguro(body.email, TAMANHO_MAXIMO_TEXTO);
  if (!nome || !email || !EMAIL_REGEX.test(email) || !body.itens?.length) {
    return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
  }

  // Preco e nome do produto vem SEMPRE do catalogo (nunca do corpo da
  // requisicao) -- confiar no que o cliente manda deixaria qualquer um
  // forjar o valor cobrado no Mercado Pago (ex.: mandar precoUnitCentavos
  // bem menor que o real).
  const catalogo = await getProdutosDestaque();

  const itensResolvidos: { produtoId: string; produtoNome: string; tamanho: string | null; quantidade: number; precoUnitCentavos: number }[] = [];
  for (const item of body.itens) {
    const quantidade = Math.trunc(item.quantidade);
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > QUANTIDADE_MAXIMA_POR_ITEM) {
      return NextResponse.json({ erro: "Quantidade invalida." }, { status: 400 });
    }

    const produto = catalogo.find((candidato) => candidato._id === item.produtoId);
    if (!produto) {
      return NextResponse.json({ erro: "Produto nao encontrado." }, { status: 400 });
    }

    const tamanho = textoSeguro(item.tamanho, 50);
    if (produto.tamanhos?.length) {
      const variante = produto.tamanhos.find((v) => v.tamanho === tamanho);
      if (!variante || variante.disponivel === false) {
        return NextResponse.json({ erro: `Tamanho indisponivel para ${produto.nome}.` }, { status: 400 });
      }
    }

    itensResolvidos.push({
      produtoId: produto._id,
      produtoNome: produto.nome,
      tamanho,
      quantidade,
      precoUnitCentavos: produto.precoCentavos,
    });
  }

  const supabase = supabaseServidor();

  // Confere estoque antes de criar o pedido -- so um alerta pro comprador
  // agora; a baixa de verdade (atomica) acontece so quando o pagamento e
  // aprovado, no webhook.
  for (const item of itensResolvidos) {
    const { data, error } = await supabase
      .from("produtos_estoque")
      .select("estoque")
      .eq("produto_id", item.produtoId)
      .eq("tamanho", item.tamanho ?? "")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ erro: "Erro ao conferir estoque." }, { status: 500 });
    }
    if (!data || data.estoque < item.quantidade) {
      return NextResponse.json({ erro: `${item.produtoNome}${item.tamanho ? ` (${item.tamanho})` : ""} sem estoque suficiente.` }, { status: 409 });
    }
  }

  const totalCentavos = itensResolvidos.reduce((total, item) => total + item.precoUnitCentavos * item.quantidade, 0);

  const { data: pedido, error: erroPedido } = await supabase
    .from("pedidos")
    .insert({
      nome_cliente: nome,
      email_cliente: email,
      telefone_cliente: textoSeguro(body.telefone, TAMANHO_MAXIMO_TEXTO),
      cep: textoSeguro(body.cep, 20),
      endereco: body.endereco ?? null,
      total_centavos: totalCentavos,
    })
    .select("id")
    .single();

  if (erroPedido || !pedido) {
    return NextResponse.json({ erro: "Nao foi possivel criar o pedido." }, { status: 500 });
  }

  const { error: erroItens } = await supabase.from("pedido_itens").insert(
    itensResolvidos.map((item) => ({
      pedido_id: pedido.id,
      produto_id: item.produtoId,
      produto_nome: item.produtoNome,
      tamanho: item.tamanho,
      quantidade: item.quantidade,
      preco_unit_centavos: item.precoUnitCentavos,
    })),
  );

  if (erroItens) {
    return NextResponse.json({ erro: "Nao foi possivel registrar os itens do pedido." }, { status: 500 });
  }

  try {
    const preferencia = await criarPreferencia({
      pedidoId: pedido.id,
      emailComprador: email,
      urlBase,
      itens: itensResolvidos.map((item) => ({
        titulo: `${item.produtoNome}${item.tamanho ? ` - ${item.tamanho}` : ""}`,
        quantidade: item.quantidade,
        precoUnitCentavos: item.precoUnitCentavos,
      })),
    });

    await supabase.from("pedidos").update({ mp_preference_id: preferencia.id }).eq("id", pedido.id);

    return NextResponse.json({ initPoint: preferencia.initPoint });
  } catch {
    return NextResponse.json({ erro: "Nao foi possivel iniciar o pagamento." }, { status: 502 });
  }
}
