/**
 * Importa pro Sanity o conteudo REAL que ja existia em src/lib/placeholders.ts
 * antes do CMS existir: os 3 titulos, o proximo jogo (Leoas x Female Futsal)
 * e os 2 produtos reais da loja (Camisa Oficial e Uniforme 2, com fotos).
 *
 * Nao importa nada inventado/fake (elenco, jogos encerrados, noticias, os
 * outros 2 produtos ainda com TODO) — isso continua so no fallback ate
 * alguem cadastrar de verdade.
 *
 * Roda com:
 *   cd studio
 *   npx sanity exec scripts/import-real-data.ts --with-user-token
 *
 * Idempotente: usa sempre o mesmo _id de cada item, entao rodar de novo so
 * atualiza (createOrReplace), nunca duplica.
 */
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

const REPO_ROOT = join(__dirname, "..", "..");

async function uploadLocalImage(publicUrl: string, alt: string) {
  const filePath = join(REPO_ROOT, "public", publicUrl.replace(/^\//, ""));
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, { filename: basename(filePath) });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
    alt,
  };
}

async function importTitulos() {
  const titulos = [
    { _id: "liga-feminina-2025", competicao: "Liga Feminina de Futsal", temporada: "2025", conquistadoEm: "2025-12-01" },
    { _id: "catarinense-ouro-2025", competicao: "Catarinense Serie Ouro", temporada: "2025", conquistadoEm: "2025-10-01" },
    { _id: "copa-do-brasil-2025-vice", competicao: "Copa do Brasil (vice)", temporada: "2025", conquistadoEm: "2025-08-01" },
  ];
  for (const t of titulos) {
    await client.createOrReplace({ _type: "titulo", ...t });
    console.log(`titulo: ${t.competicao}`);
  }
}

async function importProximoJogo() {
  const escudoAdversario = await uploadLocalImage("/brand/escudo-female-futsal.png", "Escudo do Female Futsal");
  await client.createOrReplace({
    _id: "leoas-x-female-futsal-quartas-lff-2026",
    _type: "jogo",
    competicao: "Liga Feminina de Futsal · Quartas de Final",
    adversario: "Female Futsal",
    slug: { _type: "slug", current: "leoas-x-female-futsal-quartas-lff-2026" },
    escudoAdversario,
    dataHora: "2026-09-02T20:00:00-03:00",
    local: "Ginasio Jones Minosso, Lages - SC",
    mandante: true,
    status: "agendado",
  });
  console.log("jogo: Leoas x Female Futsal (quartas LFF 2026)");
}

async function importProdutos() {
  const camisaOficial = {
    _id: "camisa-oficial-leoas-2026",
    nome: "Camisa Oficial Leoas da Serra",
    slug: "camisa-oficial",
    precoCentavos: 9900,
    categoria: "camisa",
    imagem: { url: "/products/camisa-oficial/01-frente.png", alt: "Camisa oficial Leoas da Serra, vista de frente" },
    galeria: [
      { url: "/products/camisa-oficial/02-dupla.jpg", alt: "Duas atletas das Leoas da Serra usando a camisa oficial em quadra" },
      { url: "/products/camisa-oficial/03-costas.jpg", alt: "Camisa oficial Leoas da Serra, vista de costas, com numero e nome" },
      { url: "/products/camisa-oficial/04-acao.jpg", alt: "Atleta das Leoas da Serra usando a camisa oficial durante jogo" },
    ],
    descricao: "Camisa oficial das Leoas da Serra, usada em quadra pelo elenco na temporada 2026.",
    variantesId: "TODO-nuvemshop-product-id",
    tamanhos: ["P", "M", "G", "GG", "XG", "BLG", "BLGG", "BLXG", "Infantil 12"],
    emCampanha: true,
  };

  const uniforme2 = {
    _id: "uniforme-2-leoas-2026",
    nome: "Uniforme 2 Leoas da Serra",
    slug: "uniforme-2",
    precoCentavos: 9900,
    categoria: "camisa",
    imagem: { url: "/products/uniforme-2/01-frente.png", alt: "Uniforme 2 (branco e vermelho) das Leoas da Serra, vista de frente" },
    galeria: [
      { url: "/products/uniforme-2/02-acao1.jpg", alt: "Atleta das Leoas da Serra usando o Uniforme 2 durante jogo" },
      { url: "/products/uniforme-2/03-acao2.jpg", alt: "Atleta das Leoas da Serra usando o Uniforme 2 em quadra" },
      { url: "/products/uniforme-2/04-costas.jpg", alt: "Uniforme 2 Leoas da Serra, vista de costas, com numero e nome" },
    ],
    descricao: "Segundo uniforme das Leoas da Serra, usado em quadra pelo elenco na temporada 2026.",
    variantesId: "TODO-nuvemshop-product-id-uniforme-2",
    tamanhos: ["P", "M", "G", "GG", "XG", "XGG", "BLM", "BLG", "BLP", "Infantil 10", "Infantil 14"],
    emCampanha: true,
  };

  for (const p of [camisaOficial, uniforme2]) {
    console.log(`produto: ${p.nome} — subindo ${1 + p.galeria.length} fotos...`);
    const imagem = await uploadLocalImage(p.imagem.url, p.imagem.alt);
    const imagensGaleria = [];
    for (const foto of p.galeria) {
      imagensGaleria.push(await uploadLocalImage(foto.url, foto.alt));
    }
    await client.createOrReplace({
      _id: p._id,
      _type: "produtoDestaque",
      nome: p.nome,
      slug: { _type: "slug", current: p.slug },
      precoCentavos: p.precoCentavos,
      categoria: p.categoria,
      imagem,
      imagensGaleria,
      descricao: p.descricao,
      variantesId: p.variantesId,
      tamanhos: p.tamanhos.map((tamanho) => ({
        _key: tamanho.toLowerCase().replace(/\s+/g, "-"),
        tamanho,
        variantesId: `TODO-nuvemshop-variant-${p.slug}-${tamanho}`,
        disponivel: true,
      })),
      emCampanha: p.emCampanha,
    });
    console.log(`produto: ${p.nome} importado`);
  }
}

async function main() {
  await importTitulos();
  await importProximoJogo();
  await importProdutos();
  console.log("\nPronto! Conteudo real importado pro Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
