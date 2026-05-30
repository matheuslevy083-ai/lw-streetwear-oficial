-- LW Streetwear - Supabase setup
-- Rode este SQL no Supabase: SQL Editor > New query > Run

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image text,
  images text[] default '{}',
  sizes text[] default '{}',
  in_stock boolean default true,
  reservation_price numeric(10,2),
  delivery_estimate text default 'Entrega em 10 a 15 dias úteis após o fechamento do lote',
  drop_name text default 'DROP 001 — GOLD BLACK',
  gender text default 'Unissex' check (gender in ('Masculino', 'Feminino', 'Unissex')),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

-- Todos podem ver os produtos na loja pública.
drop policy if exists "Produtos públicos podem ser lidos" on public.products;
create policy "Produtos públicos podem ser lidos"
on public.products for select
to anon, authenticated
using (true);

-- Só o email admin pode criar/editar/apagar produtos.
drop policy if exists "Admin pode criar produtos" on public.products;
create policy "Admin pode criar produtos"
on public.products for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'matheuslevy083@gmail.com');

drop policy if exists "Admin pode editar produtos" on public.products;
create policy "Admin pode editar produtos"
on public.products for update
to authenticated
using ((auth.jwt() ->> 'email') = 'matheuslevy083@gmail.com')
with check ((auth.jwt() ->> 'email') = 'matheuslevy083@gmail.com');

drop policy if exists "Admin pode apagar produtos" on public.products;
create policy "Admin pode apagar produtos"
on public.products for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'matheuslevy083@gmail.com');

-- Bucket público para fotos dos produtos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Todos podem visualizar fotos públicas.
drop policy if exists "Fotos públicas podem ser lidas" on storage.objects;
create policy "Fotos públicas podem ser lidas"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

-- Só o admin pode enviar/editar/apagar fotos.
drop policy if exists "Admin pode enviar fotos" on storage.objects;
create policy "Admin pode enviar fotos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'matheuslevy083@gmail.com');

drop policy if exists "Admin pode atualizar fotos" on storage.objects;
create policy "Admin pode atualizar fotos"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'matheuslevy083@gmail.com')
with check (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'matheuslevy083@gmail.com');

drop policy if exists "Admin pode apagar fotos" on storage.objects;
create policy "Admin pode apagar fotos"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and (auth.jwt() ->> 'email') = 'matheuslevy083@gmail.com');

-- Produtos iniciais. Eles usam imagens da pasta public do seu projeto.
insert into public.products (name, description, price, image, images, sizes, reservation_price, delivery_estimate, drop_name, gender, sort_order)
values
('Camiseta Oversized Preta', 'Camiseta oversized 100% algodão, conforto e estilo urbano. Peça principal da coleção LW Streetwear.', 89.90, '/black-oversized-streetwear-t-shirt.jpg', array['/black-oversized-streetwear-t-shirt.jpg','/black-t-shirt-with-gold-logo-streetwear.jpg'], array['P','M','G','GG'], 40, 'Entrega em 10 a 15 dias úteis após o fechamento do lote', 'DROP 001 — GOLD BLACK', 'Masculino', 1),
('Moletom LW Gold Edition', 'Moletom premium com detalhes dourados, capuz ajustável e bolso canguru.', 189.90, '/black-hoodie-with-gold-details-streetwear.jpg', array['/black-hoodie-with-gold-details-streetwear.jpg'], array['P','M','G','GG','XG'], 80, 'Entrega em 10 a 15 dias úteis após o fechamento do lote', 'DROP 001 — GOLD BLACK', 'Masculino', 2),
('Calça Cargo Black', 'Calça cargo com múltiplos bolsos, ajuste perfeito e tecido resistente.', 159.90, '/black-cargo-pants-streetwear.png', array['/black-cargo-pants-streetwear.png'], array['38','40','42','44','46'], 60, 'Entrega em 10 a 15 dias úteis após o fechamento do lote', 'DROP 001 — GOLD BLACK', 'Masculino', 3),
('Jaqueta Corta-Vento', 'Jaqueta impermeável com forro interno, ideal para compor o visual streetwear.', 249.90, '/black-windbreaker-jacket-streetwear.jpg', array['/black-windbreaker-jacket-streetwear.jpg'], array['P','M','G','GG'], 100, 'Entrega em 10 a 15 dias úteis após o fechamento do lote', 'DROP 001 — GOLD BLACK', 'Masculino', 4),
('Bermuda Streetwear', 'Bermuda confortável com modelagem urbana e cordão ajustável.', 79.90, '/black-streetwear-shorts.jpg', array['/black-streetwear-shorts.jpg'], array['P','M','G','GG'], 35, 'Entrega em 10 a 15 dias úteis após o fechamento do lote', 'DROP 001 — GOLD BLACK', 'Masculino', 5),
('Camiseta LW Logo Gold', 'Camiseta preta com logo LW em dourado, visual limpo e premium.', 99.90, '/black-t-shirt-with-gold-logo-streetwear.jpg', array['/black-t-shirt-with-gold-logo-streetwear.jpg','/black-oversized-streetwear-t-shirt.jpg'], array['P','M','G','GG'], 40, 'Entrega em 10 a 15 dias úteis após o fechamento do lote', 'DROP 001 — GOLD BLACK', 'Masculino', 6)
on conflict do nothing;
