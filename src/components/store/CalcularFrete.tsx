"use client";

import { useState } from "react";
import { formatarPreco } from "@/lib/format";
import type { PacoteEnvio } from "@/types/content";

interface OpcaoFrete {
  transportadora: string;
  servico: string;
  precoCentavos: number;
  prazoDias: number | null;
}

/**
 * Estimativa de frete (widget "calcular frete" na pagina do produto). So
 * uma previa pra ajudar na decisao de compra — o valor real e o que a
 * Nuvemshop cobra no checkout dela, calculado com o peso/dimensoes que ja
 * estao cadastrados la.
 */
export function CalcularFrete({ pacote, precoCentavos }: { pacote?: PacoteEnvio; precoCentavos: number }) {
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState<"idle" | "carregando" | "erro" | "indisponivel" | "ok">("idle");
  const [opcoes, setOpcoes] = useState<OpcaoFrete[]>([]);

  if (!pacote) return null;

  async function calcular() {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setEstado("erro");
      return;
    }

    setEstado("carregando");
    try {
      const resposta = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cepDestino: cepLimpo,
          pacote: { ...pacote, quantidade: 1, precoCentavos },
        }),
      });

      if (resposta.status === 503) {
        setEstado("indisponivel");
        return;
      }
      if (!resposta.ok) {
        setEstado("erro");
        return;
      }

      const dados = (await resposta.json()) as { opcoes: OpcaoFrete[] };
      setOpcoes(dados.opcoes);
      setEstado("ok");
    } catch {
      setEstado("erro");
    }
  }

  return (
    <div className="mt-8 border-t border-line pt-6">
      <p className="font-mono-label text-[11px] text-gray">Calcular frete</p>
      <div className="mt-3 flex max-w-xs gap-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="00000-000"
          value={cep}
          onChange={(event) => setCep(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && calcular()}
          maxLength={9}
          className="w-full rounded-sm border border-line bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-gray focus:border-white/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={calcular}
          disabled={estado === "carregando"}
          className="font-mono-label shrink-0 rounded-sm border border-line px-4 py-2.5 text-xs text-white/80 transition-colors hover:border-white/50 disabled:opacity-40"
        >
          {estado === "carregando" ? "..." : "Calcular"}
        </button>
      </div>

      {estado === "erro" && <p className="mt-2 text-xs text-red">CEP invalido.</p>}
      {estado === "indisponivel" && <p className="mt-2 text-xs text-gray">Calculo de frete indisponivel no momento.</p>}
      {estado === "ok" && opcoes.length === 0 && <p className="mt-2 text-xs text-gray">Nenhuma opcao de frete encontrada pra esse CEP.</p>}
      {estado === "ok" && opcoes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {opcoes.map((opcao) => (
            <li key={`${opcao.transportadora}-${opcao.servico}`} className="flex items-center justify-between text-sm text-white/80">
              <span>
                {opcao.transportadora} {opcao.servico}
                {opcao.prazoDias && <span className="text-gray"> · ate {opcao.prazoDias} dias uteis</span>}
              </span>
              <span className="text-white">{formatarPreco(opcao.precoCentavos)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-gray">Valor estimado. O frete final e calculado no fechamento da compra.</p>
    </div>
  );
}
