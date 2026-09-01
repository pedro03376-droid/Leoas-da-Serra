# Leoas da Serra

Site oficial das Leoas da Serra — futsal feminino de Lages, Santa Catarina.

Construido em fases: **Fase 1** (este repositorio, no estado atual) cobre a
intro cinematografica, a Home e a Loja. Fases 2 (Match Center, elenco, perfil
da atleta) e 3 (institucional) vem depois, uma secao por vez.

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
  components/
    intro/                # Intro cinematografica (Intro.tsx, IntroGate.tsx)
    motion/                # Motion system: os 9 padroes reutilizaveis
    layout/                # Header, Footer, MobileActionBar
    home/                  # Secoes da Home
    store/                 # Loja: cart, product card, collection, etc.
  lib/
    content.ts             # camada de leitura de conteudo (Sanity -> placeholder)
    placeholders.ts        # dados provisorios, TODO ate o CMS
    nuvemshop.ts            # onCheckout() -> Nuvemshop
    fonts.ts, motion.ts, cn.ts, format.ts
  sanity/
    client.ts, env.ts, queries.ts
    schemas/                # modelo de conteudo (ver "CMS" abaixo)
  types/content.ts          # tipos que espelham os schemas do Sanity
```

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
so tipografia, o escudo (placeholder ate o vetor oficial chegar), formas
geometricas, linhas e mascaras, exatamente como especificado no documento de
instrucao original.

## CMS: Sanity

O site **nao guarda conteudo no codigo** — so le do CMS. `src/sanity/schemas/`
define o modelo (`atleta`, `jogo`, `noticia`, `titulo`, `temporada`,
`parceiro`, `produtoDestaque`) usando um shim leve local de
`defineField`/`defineType` (`src/sanity/schemas/defineHelpers.ts`) — **este
app Next.js nao roda o Sanity Studio**, so consome dados via API. Para
provisionar o CMS de verdade:

1. `npx sanity init` num diretorio separado (ou noutro repo) para criar o
   projeto/Studio.
2. Copiar o conteudo de `src/sanity/schemas/*.ts` para o `schema.types` do
   Studio (trocando o import de `./defineHelpers` pelo pacote `sanity` real).
3. Publicar o Studio e preencher o conteudo.
4. Configurar as variaveis de ambiente abaixo neste projeto — a partir daí o
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

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha quando o CMS/loja
existirem — nenhuma delas e obrigatoria para rodar o site com os placeholders.

| Variavel | Onde e usada | Observacao |
|---|---|---|
| `SANITY_PROJECT_ID` | servidor | sem isso, o site usa os placeholders |
| `SANITY_DATASET` | servidor | padrao `production` |
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

Tudo marcado com `TODO` no codigo depende de um asset real: o vetor oficial
do escudo (`public/placeholders/escudo-leoas.svg`), fotos de jogadoras e
produtos, e os dados reais de proximo jogo / temporada / noticias que virao
do Sanity. Titulos e competicoes em `src/lib/placeholders.ts` (`TITULOS_REAIS`,
`COMPETICOES`) ja sao reais.
