# Leoas da Serra

Site oficial das Leoas da Serra — futsal feminino de Lages, Santa Catarina.

Construido em fases: **Fase 1** cobriu a intro cinematografica, a Home e a
Loja. **Fase 2** (neste repositorio, no estado atual) adiciona o Match
Center, o elenco editorial e o perfil da atleta. Fase 3 (institucional) vem
depois, uma secao por vez.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger (timelines de scroll, reveals)
- [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll)
- Framer Motion (transicoes de pagina e componentes)
- Sanity (CMS headless — arquitetura pronta, ver abaixo)
- Nuvemshop (loja — checkout agnostico via `onCheckout()`)
- Deploy alvo: Vercel

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Sem nenhuma variavel de
ambiente configurada, o site funciona normalmente usando os **dados
placeholder** em `src/lib/placeholders.ts` (marcados com `TODO`) no lugar do
CMS.

```bash
npm run build   # build de producao (typecheck + lint incluidos)
npm run lint    # eslint
```

## Estrutura

```
src/
  app/                    # rotas (App Router)
    page.tsx              # Home
    loja/page.tsx          # Loja — colecao
    loja/[slug]/page.tsx   # Loja — produto
    agenda/page.tsx         # Agenda — lista de jogos (proximos e resultados)
    jogos/[slug]/page.tsx   # Match Center — pagina de cada jogo
    elenco/page.tsx         # Elenco — grid editorial
    elenco/[slug]/page.tsx  # Perfil da atleta
  components/
    intro/                # Intro cinematografica (Intro.tsx, IntroGate.tsx)
    motion/                # Motion system: os 9 padroes reutilizaveis
    layout/                # Header, Footer, MobileActionBar
    home/                  # Secoes da Home
      hero/                  # Hero: composicao editorial do proximo jogo (ver "Hero" abaixo)
    store/                 # Loja: cart, product card, collection, etc.
    match/                 # Match Center: header, stats, timeline, escalacao, fotos
    roster/                 # Elenco: card editorial, perfil da atleta
  lib/
    content.ts             # camada de leitura de conteudo (Sanity -> placeholder)
    placeholders.ts        # dados provisorios, TODO ate o CMS
    nuvemshop.ts            # onCheckout() -> Nuvemshop
    fonts.ts, motion.ts, cn.ts, format.ts, brand.ts
  sanity/
    client.ts, env.ts, queries.ts
    schemas/                # modelo de conteudo (ver "CMS" abaixo)
  types/content.ts          # tipos que espelham os schemas do Sanity
```

## Hero da Home

`src/components/home/hero/`. Composicao editorial do proximo jogo (sem
video): `HeroBackground` (grafite, grao, luz radial, linhas quase
invisiveis), `HeroEditorialTag` ("Next Match" vertical, so desktop —
propria coluna na grade, ver `.hero-grid` em `globals.css`), `HeroPhoto`
(painel de campanha com parallax sutil e leve efeito magnetico no hover —
ainda sem foto oficial da atleta, `public/placeholders/hero-campanha.svg`
marca o lugar ate a foto real entrar) e `HeroActions` (dois CTAs
minimalistas: Match Center e Agenda). `Hero.tsx` orquestra tudo numa unica
timeline GSAP coordenada na entrada e um recuo sutil no scroll — nunca
efeitos isolados. Todo o conteudo (competicao, adversario, data, local,
escudos) vem do mesmo `jogo` que a Home ja buscava; nada foi inventado.

## Motion system

Nove padroes, cada um um componente/hook reutilizavel em
`src/components/motion/`: `TextReveal`, `ImageReveal`, `Parallax`,
`ScaleOnScroll`, `Counter`, `LineDraw`, `HoverLink` (+ utilitario CSS
`.hover-zoom`), `CustomCursor`, `SmoothScrollProvider` (Lenis + GSAP
ticker). A transicao entre paginas fica em `src/app/template.tsx`
(Framer Motion). Toda animacao verifica `usePrefersReducedMotion()`
(`src/hooks/usePrefersReducedMotion.ts`) e cai para o estado final estatico
quando `prefers-reduced-motion: reduce` esta ativo — a intro incluida.

## Intro cinematografica

`src/components/intro/`. Roda so na primeira visita da sessao (flag em
`sessionStorage`, `src/components/intro/useIntroSeen.ts`), nunca com
`prefers-reduced-motion`, e sempre tem um botao "Pular" visivel. Sem video —
so tipografia, o escudo oficial, formas geometricas, linhas e mascaras,
exatamente como especificado no documento de instrucao original.

## Match Center e Elenco

`/agenda` lista os jogos (proximos e resultados, `src/lib/content.ts#getJogos`)
e cada card leva ao Match Center do jogo em `/jogos/[slug]`: placar,
estatisticas comparativas (barras Leoas x adversario), timeline de eventos
minuto a minuto e a escalacao das Leoas, cada jogadora linkando para o
proprio perfil.

`/elenco` e a grade editorial (numero grande + nome + posicao, alturas
variadas via `src/components/roster/RosterCard.tsx`); clicar leva a
`/elenco/[slug]`, com bio, estatisticas por posicao e galeria de midia.

Esses dados vivem nos schemas `jogo` (campos `escalacaoLeoas`, `eventos`,
`statsComparativas`, `fotos`) e `atleta` (`statsPosicao`, `midia`) — ver
`src/sanity/schemas/`.

## CMS: Sanity

O site **nao guarda conteudo no codigo** — so le do CMS. `src/sanity/schemas/`
define o modelo (`atleta`, `jogo`, `noticia`, `titulo`, `temporada`,
`parceiro`, `produtoDestaque`) usando um shim leve local de
`defineField`/`defineType` (`src/sanity/schemas/defineHelpers.ts`) — **este
app Next.js nao roda o Sanity Studio**, so consome dados via API.

O Studio de verdade (painel de edicao) ja esta em `studio/` — um projeto
separado que importa os mesmos schemas de `src/sanity/schemas/` (fonte
unica, nada duplicado) e ja aponta para o projeto Sanity real (`projectId`
e `dataset` em `studio/sanity.config.ts` / `studio/sanity.cli.ts`).

**Publicar o Studio** (o login e o deploy precisam rodar na sua maquina —
exigem abrir o navegador e nao funcionam num agente remoto):

```bash
cd studio
npm install
npx sanity login     # abre o navegador, autorize com a conta do projeto
npx sanity deploy    # publica num link fixo, ex.: leoas-da-serra.sanity.studio
```

**No dia a dia**, depois de publicado, o Studio fica disponivel nesse link —
so abrir e cadastrar (jogos, atletas, produtos, noticias etc.), sem precisar
rodar nada localmente de novo.

**Ligar o site ao Sanity**: configurar as variaveis de ambiente abaixo neste
projeto (`SANITY_PROJECT_ID` e `SANITY_DATASET`) na Vercel — a partir daí o
site passa a ler do Sanity automaticamente (`src/lib/content.ts` cai para
os placeholders sempre que `SANITY_PROJECT_ID` nao estiver definido).

As buscas (GROQ, `src/sanity/queries.ts`) e o client (`src/sanity/client.ts`)
rodam **so no servidor** (`import "server-only"`) — nenhuma chave chega ao
código do cliente, e o site publico e somente leitura (nenhuma rota de
edicao exposta).

## Loja: Nuvemshop

O carrinho (`src/components/store/CartContext.tsx`) e so uma sacola de UI —
estoque, pagamento, nota fiscal e frete ficam inteiramente na Nuvemshop.
`onCheckout()` (`src/lib/nuvemshop.ts`) redireciona para o checkout da loja;
troque `NEXT_PUBLIC_NUVEMSHOP_STORE_URL` pelo dominio real, e se a integracao
evoluir para o Buy Button / Checkout API da Nuvemshop, o corpo dessa funcao
e o unico lugar a mudar.

### Tamanhos e fotos do produto

Cada tamanho (`ProdutoDestaque.tamanhos`, tipo `VarianteTamanho`) e uma
variante/SKU propria na Nuvemshop — `resolverVariantesId()` em
`src/lib/nuvemshop.ts` escolhe o id certo na hora do checkout a partir do
tamanho escolhido na pagina do produto (`ProductDetail.tsx`, que tambem
mostra a galeria de fotos a partir de `imagem` + `imagensGaleria`). Produto
sem `tamanhos` (ex.: cachecol) usa o `variantesId` do produto direto, e o
"+" rapido da grade (`ProductCard.tsx`) some nesse caso — vira link pra
pagina, pra nunca escolher tamanho pela cliente.

**Pra cadastrar as camisas em lote agora** (antes do Sanity existir): me
manda nome, preco, categoria, os tamanhos disponiveis e as 4-5 fotos de
cada camisa, e eu cadastro tudo de uma vez em `src/lib/placeholders.ts`
(`PRODUTOS_PLACEHOLDER`) — funciona no site imediatamente. Os
`variantesId` de cada tamanho ficam `TODO` ate a Nuvemshop estar
conectada; a estrutura ja é a mesma que o Sanity vai usar depois (schema
`produtoDestaque` em `src/sanity/schemas/produtoDestaque.ts`), entao
migrar pro CMS mais tarde e so preencher o mesmo formato la.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha quando o CMS/loja
existirem — nenhuma delas e obrigatoria para rodar o site com os placeholders.

| Variavel | Onde e usada | Observacao |
|---|---|---|
| `SANITY_PROJECT_ID` | servidor | sem isso, o site usa os placeholders. Projeto atual: `pvg8mwks` |
| `SANITY_DATASET` | servidor | `production` |
| `SANITY_READ_TOKEN` | servidor | so se o dataset nao for publico |
| `NEXT_PUBLIC_NUVEMSHOP_STORE_URL` | client (checkout) | dominio da loja Nuvemshop |

## Checklist de seguranca

- [ ] Paineis administrativos (Sanity Studio, Nuvemshop) protegidos por
      login + **2FA sempre ativo**.
- [ ] Senhas fortes, unicas por servico, geradas por gerenciador de senhas.
- [ ] 2 niveis de acesso no Sanity: **admin** (total) e **editor** (social
      media do clube — publica noticia/jogo, sem acesso a configuracao).
- [ ] Revogar acesso de qualquer pessoa que sair da equipe, nos dois
      paineis, imediatamente.
- [ ] `SANITY_READ_TOKEN` e qualquer chave/token **nunca** commitados —
      so em variaveis de ambiente do servidor (Vercel).
- [ ] Nenhuma rota de edicao de conteudo exposta no site publico (o Next.js
      so le, nunca escreve, no Sanity).

## Assets pendentes

O escudo oficial ja esta em uso (`public/brand/escudo-leoas.png`, referenciado
via `src/lib/brand.ts`). O que ainda falta, marcado com `TODO` no codigo:
a fotografia oficial da campanha no Hero (troque `HERO_CAMPANHA_SRC` em
`src/components/home/hero/HeroPhoto.tsx` — 4:5, editorial, atleta em
quadra), fotos de jogadoras e produtos, e os dados reais de proximo jogo /
temporada / noticias que virao do Sanity. Titulos e competicoes em
`src/lib/placeholders.ts` (`TITULOS_REAIS`, `COMPETICOES`) ja sao reais.
