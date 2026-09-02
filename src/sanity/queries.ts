import groq from "groq";

const imageFragment = groq`{
  "url": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot
}`;

const escalacaoFragment = groq`{
  "atletaId": atleta->_id,
  "slug": atleta->slug.current,
  "numero": atleta->numero,
  "nome": atleta->nome,
  "posicao": atleta->posicao,
  "foto": atleta->foto${imageFragment},
  titular
}`;

const jogoCompletoFragment = groq`{
  _id, competicao, adversario, "slug": slug.current, dataHora, local, mandante,
  placarLeoas, placarAdversario, transmissaoUrl, ingressoUrl, status,
  "escudoAdversario": escudoAdversario${imageFragment},
  "escalacaoLeoas": escalacaoLeoas[]${escalacaoFragment},
  eventos,
  statsComparativas,
  "fotos": fotos[]${imageFragment}
}`;

export const proximoJogoQuery = groq`
  *[_type == "jogo" && status != "encerrado"] | order(dataHora asc)[0]{
    _id, competicao, adversario, "slug": slug.current, dataHora, local, mandante,
    placarLeoas, placarAdversario, transmissaoUrl, ingressoUrl, status,
    "escudoAdversario": escudoAdversario${imageFragment}
  }
`;

export const jogosQuery = groq`
  *[_type == "jogo"] | order(dataHora desc){
    _id, competicao, adversario, "slug": slug.current, dataHora, local, mandante,
    placarLeoas, placarAdversario, status,
    "escudoAdversario": escudoAdversario${imageFragment}
  }
`;

export const jogoPorSlugQuery = groq`
  *[_type == "jogo" && slug.current == $slug][0]${jogoCompletoFragment}
`;

export const noticiasQuery = groq`
  *[_type == "noticia"] | order(publicadoEm desc)[0...9]{
    _id, titulo, resumo, "slug": slug.current, publicadoEm, destaque,
    "capa": capa${imageFragment}
  }
`;

export const titulosQuery = groq`
  *[_type == "titulo"] | order(conquistadoEm desc){
    _id, competicao, temporada, conquistadoEm
  }
`;

export const temporadaAtualQuery = groq`
  *[_type == "temporada"] | order(ano desc)[0]{
    _id, ano, vitorias, empates, derrotas, golsPro, golsContra
  }
`;

export const elencoQuery = groq`
  *[_type == "atleta"] | order(numero asc){
    _id, nome, "slug": slug.current, numero, posicao, altura, bio,
    "foto": foto${imageFragment}
  }
`;

export const atletaPorSlugQuery = groq`
  *[_type == "atleta" && slug.current == $slug][0]{
    _id, nome, "slug": slug.current, numero, posicao, altura, bio,
    "foto": foto${imageFragment},
    statsPosicao,
    "midia": midia[]${imageFragment}
  }
`;

export const parceirosQuery = groq`
  *[_type == "parceiro"] | order(nivel asc){
    _id, nome, nivel, url,
    "logo": logo${imageFragment}
  }
`;

export const produtosDestaqueQuery = groq`
  *[_type == "produtoDestaque"] | order(emCampanha desc){
    _id, nome, "slug": slug.current, precoCentavos, categoria, descricao, variantesId, tamanhos, emCampanha,
    "imagem": imagem${imageFragment},
    "imagensGaleria": imagensGaleria[]${imageFragment}
  }
`;

export const produtoPorSlugQuery = groq`
  *[_type == "produtoDestaque" && slug.current == $slug][0]{
    _id, nome, "slug": slug.current, precoCentavos, categoria, descricao, variantesId, tamanhos, emCampanha,
    "imagem": imagem${imageFragment},
    "imagensGaleria": imagensGaleria[]${imageFragment}
  }
`;
