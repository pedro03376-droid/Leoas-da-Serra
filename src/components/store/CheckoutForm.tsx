"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { formatarPreco } from "@/lib/format";

const CAMPO = "w-full rounded-sm border border-line bg-transparent px-3.5 py-2.5 text-sm text-white placeholder:text-gray focus:border-white/50 focus:outline-none";
const LABEL = "font-mono-label text-[11px] text-gray";

export function CheckoutForm() {
  const { lines, totalCentavos } = useCart();
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [dados, setDados] = useState({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  function set<K extends keyof typeof dados>(campo: K, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  if (lines.length === 0) {
    return <p className="text-sm text-gray">Sua sacola esta vazia.</p>;
  }

  async function finalizar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          cep: dados.cep,
          endereco: {
            rua: dados.rua,
            numero: dados.numero,
            complemento: dados.complemento,
            bairro: dados.bairro,
            cidade: dados.cidade,
            estado: dados.estado,
          },
          itens: lines.map((line) => ({
            produtoId: line.produto._id,
            produtoNome: line.produto.nome,
            tamanho: line.tamanho,
            quantidade: line.quantidade,
            precoUnitCentavos: line.produto.precoCentavos,
          })),
        }),
      });

      const json = (await resposta.json()) as { initPoint?: string; erro?: string };

      if (!resposta.ok || !json.initPoint) {
        setErro(json.erro ?? "Nao foi possivel iniciar o pagamento. Tente novamente.");
        setEnviando(false);
        return;
      }

      // Navegacao proposital pro checkout hospedado do Mercado Pago.
      window.location.href = json.initPoint;
    } catch {
      setErro("Falha de conexao. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={finalizar} className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-5">
        <div>
          <label className={LABEL} htmlFor="nome">Nome completo</label>
          <input id="nome" required value={dados.nome} onChange={(e) => set("nome", e.target.value)} className={`${CAMPO} mt-1.5`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL} htmlFor="email">E-mail</label>
            <input id="email" type="email" required value={dados.email} onChange={(e) => set("email", e.target.value)} className={`${CAMPO} mt-1.5`} />
          </div>
          <div>
            <label className={LABEL} htmlFor="telefone">WhatsApp</label>
            <input id="telefone" required value={dados.telefone} onChange={(e) => set("telefone", e.target.value)} className={`${CAMPO} mt-1.5`} />
          </div>
        </div>

        <p className={`${LABEL} pt-2`}>Endereco de entrega</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={LABEL} htmlFor="cep">CEP</label>
            <input id="cep" required maxLength={9} value={dados.cep} onChange={(e) => set("cep", e.target.value)} className={`${CAMPO} mt-1.5`} />
          </div>
          <div className="col-span-2">
            <label className={LABEL} htmlFor="rua">Rua</label>
            <input id="rua" required value={dados.rua} onChange={(e) => set("rua", e.target.value)} className={`${CAMPO} mt-1.5`} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={LABEL} htmlFor="numero">Numero</label>
            <input id="numero" required value={dados.numero} onChange={(e) => set("numero", e.target.value)} className={`${CAMPO} mt-1.5`} />
          </div>
          <div className="col-span-2">
            <label className={LABEL} htmlFor="complemento">Complemento</label>
            <input id="complemento" value={dados.complemento} onChange={(e) => set("complemento", e.target.value)} className={`${CAMPO} mt-1.5`} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className={LABEL} htmlFor="bairro">Bairro</label>
            <input id="bairro" required value={dados.bairro} onChange={(e) => set("bairro", e.target.value)} className={`${CAMPO} mt-1.5`} />
          </div>
          <div>
            <label className={LABEL} htmlFor="estado">UF</label>
            <input id="estado" required maxLength={2} value={dados.estado} onChange={(e) => set("estado", e.target.value.toUpperCase())} className={`${CAMPO} mt-1.5`} />
          </div>
        </div>
        <div>
          <label className={LABEL} htmlFor="cidade">Cidade</label>
          <input id="cidade" required value={dados.cidade} onChange={(e) => set("cidade", e.target.value)} className={`${CAMPO} mt-1.5`} />
        </div>
      </div>

      <div className="h-fit rounded-sm border border-line p-6">
        <h2 className="font-display text-lg text-white">Resumo</h2>
        <ul className="mt-4 space-y-3">
          {lines.map((line) => (
            <li key={`${line.produto._id}-${line.tamanho ?? "unico"}`} className="flex justify-between text-sm text-white/80">
              <span>
                {line.produto.nome}
                {line.tamanho && ` · ${line.tamanho}`} × {line.quantidade}
              </span>
              <span>{formatarPreco(line.produto.precoCentavos * line.quantidade)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm text-white">
          <span>Total</span>
          <span className="font-display text-lg">{formatarPreco(totalCentavos)}</span>
        </div>

        {erro && <p className="mt-4 text-xs text-red">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="font-mono-label mt-6 w-full rounded-full bg-red py-3.5 text-xs text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {enviando ? "Redirecionando..." : "Ir para o pagamento"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/loja")}
          className="font-mono-label mt-3 w-full text-center text-[11px] text-gray hover:text-white"
        >
          Voltar pra loja
        </button>
      </div>
    </form>
  );
}
