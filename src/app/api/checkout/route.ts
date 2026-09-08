import { NextResponse } from "next/server";
import { criarPreferencia, mercadoPagoConfigurado } from "@/lib/mercadopago";
import { supabaseConfigurado, supabaseServidor } from "@/lib/supabase";

interface ItemRequisicao {
  produtoId: string;
  produtoNome: string;
  tamanho?: string;
  quantidade: number;
  precoUnitCentavos: number;
}

interface ChekoutRequisicao {
  nome: string;
  email: string;
  telefone?: string;
  cep?: string;
  endereco?: Record<string, string>;
  itens: ItemRequisicao[];
}

function urlBaseDe(request: Request): string {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL;
  if (configurada) return configurada.replace(/\/$/, "");
  const origem = request.headers.get("origin");
  if (origem) return origem;
  const host = request.headers.get("host");
  return `https://${host}`;
}

export async function POST(request: Request) {
  if (!supabaseConfigurado() || !mercadoPagoConfigurado()) {
    return NextResponse.json({ erro: "Checkout proprio ainda nao configurado." }, { status: 503 });
  }

  const body = (await request.json()) as ChekoutRequisicao;

  if (!body.nome || !body.email || !body.itens?.length) {
    return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
  }

  const supabase = supabaseServidor();

  // Confere estoque antes de criar o pedido -- so um alerta pro comprador
  // agora; a baixa de verdade (atomica) acontece so quando o pagamento e
  // aprovado, no webhook.
  for (const item of body.itens) {
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

  const totalCentavos = body.itens.reduce((total, item) => total + item.precoUnitCentavos * item.quantidade, 0);

  const { data: pedido, error: erroPedido } = await supabase
    .from("pedidos")
    .insert({
      nome_cliente: body.nome,
      email_cliente: body.email,
      telefone_cliente: body.telefone ?? null,
      cep: body.cep ?? null,
      endereco: body.endereco ?? null,
      total_centavos: totalCentavos,
    })
    .select("id")
    .single();

  if (erroPedido || !pedido) {
    return NextResponse.json({ erro: "Nao foi possivel criar o pedido." }, { status: 500 });
  }

  const { error: erroItens } = await supabase.from("pedido_itens").insert(
    body.itens.map((item) => ({
      pedido_id: pedido.id,
      produto_id: item.produtoId,
      produto_nome: item.produtoNome,
      tamanho: item.tamanho ?? null,
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
      emailComprador: body.email,
      urlBase: urlBaseDe(request),
      itens: body.itens.map((item) => ({
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
