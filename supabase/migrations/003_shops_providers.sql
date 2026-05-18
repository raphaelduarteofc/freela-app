-- =====================================================
-- 003: Shops & Service Providers
-- =====================================================

-- Lojas (Lojistas)
create table public.shops (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.users(id) on delete cascade,
  name            text not null,
  cnpj            text unique,
  plan            text not null default 'starter' check (plan in ('starter', 'growth', 'enterprise')),
  address_street  text,
  address_number  text,
  address_city    text not null,
  address_state   text not null,
  address_zip     text,
  location        geography(Point, 4326),
  phone           text,
  is_active       boolean not null default true,
  settings        jsonb not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index shops_user_id_idx on public.shops(user_id);
create index shops_location_idx on public.shops using gist(location);

create trigger shops_updated_at
  before update on public.shops
  for each row execute function update_updated_at();

-- RLS Shops
alter table public.shops enable row level security;

create policy "Lojista vê própria loja"
  on public.shops for select
  using (user_id = auth.uid());

create policy "Lojista pode atualizar própria loja"
  on public.shops for update
  using (user_id = auth.uid());

create policy "Lojista pode criar loja"
  on public.shops for insert
  with check (user_id = auth.uid());

create policy "Prestador vê lojas (para OS)"
  on public.shops for select
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'prestador'
    )
  );

create policy "Admin vê todas as lojas"
  on public.shops for select
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- =====================================================

-- Prestadores de Serviço
create table public.service_providers (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null unique references public.users(id) on delete cascade,
  cpf_cnpj        text not null unique,
  cert_level      cert_level not null default 'bronze',
  bio             text,
  specialties     text[] default '{}',
  rating          numeric(3,2) not null default 0,
  rating_count    integer not null default 0,
  completion_rate numeric(5,4) not null default 0,
  radius_km       integer not null default 30,
  location        geography(Point, 4326),
  address_city    text,
  address_state   text,
  is_available    boolean not null default true,
  is_active       boolean not null default true,
  plan            text not null default 'free' check (plan in ('free', 'pro', 'elite')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index sp_user_id_idx    on public.service_providers(user_id);
create index sp_location_idx   on public.service_providers using gist(location);
create index sp_cert_level_idx on public.service_providers(cert_level);
create index sp_available_idx  on public.service_providers(is_available) where is_available = true;

create trigger sp_updated_at
  before update on public.service_providers
  for each row execute function update_updated_at();

-- RLS Service Providers
alter table public.service_providers enable row level security;

create policy "Prestador vê próprio perfil"
  on public.service_providers for select
  using (user_id = auth.uid());

create policy "Lojistas e admins veem prestadores"
  on public.service_providers for select
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role in ('lojista', 'admin', 'fabricante')
    )
  );

create policy "Prestador atualiza próprio perfil"
  on public.service_providers for update
  using (user_id = auth.uid());

create policy "Prestador cria próprio perfil"
  on public.service_providers for insert
  with check (user_id = auth.uid());
