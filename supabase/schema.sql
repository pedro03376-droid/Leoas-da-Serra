-- Schema do checkout proprio (estoque + pedidos). Rodar uma vez no
-- SQL Editor do painel Supabase (Project > SQL Editor > New query > Run).
--
-- Nada aqui depende da Nuvemshop: e o banco de dados proprio do clube,
-- pra ter controle total dos dados de pedido/estoque sem depender de
-- plataforma nenhuma.

create table if not exists produtos_estoque (
  produto_id text not null,
  tamanho text not null default '',
  estoque integer not null default 0,
  atualizado_em timestamptz not null default now(),
  primary key (produto_id, tamanho)
);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'aguardando_pagamento',
  nome_cliente text not null,
  email_cliente text not null,
  telefone_cliente text,
  cep text,
  endereco jsonb,
  total_centavos integer not null,
  mp_preference_id text,
  mp_payment_id text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists pedido_itens (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  produto_id text not null,
  produto_nome text not null,
  tamanho text,
  quantidade integer not null,
  preco_unit_centavos integer not null
);

create index if not exists pedido_itens_pedido_id_idx on pedido_itens (pedido_id);
create index if not exists pedidos_mp_preference_id_idx on pedidos (mp_preference_id);

-- Baixa o estoque de forma atomica (evita vender a mesma unidade duas vezes
-- se dois pagamentos forem confirmados ao mesmo tempo). Retorna false se
-- nao tinha estoque suficiente -- nesse caso o pedido fica marcado pra
-- conferencia manual em vez de deixar o estoque negativo.
create or replace function baixar_estoque(p_produto_id text, p_tamanho text, p_quantidade integer)
returns boolean
language plpgsql
as $$
declare
  linhas_afetadas integer;
begin
  update produtos_estoque
    set estoque = estoque - p_quantidade, atualizado_em = now()
    where produto_id = p_produto_id
      and tamanho = coalesce(p_tamanho, '')
      and estoque >= p_quantidade;
  get diagnostics linhas_afetadas = row_count;
  return linhas_afetadas > 0;
end;
$$;

-- Estoque inicial de exemplo -- ajustar pelos numeros reais de cada
-- tamanho direto na tabela (painel Supabase > Table Editor > produtos_estoque).
-- insert into produtos_estoque (produto_id, tamanho, estoque) values
--   ('uniforme-3-leoas-2026', 'M', 10),
--   ('uniforme-3-leoas-2026', 'G', 10);
