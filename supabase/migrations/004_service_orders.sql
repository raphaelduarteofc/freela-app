-- =====================================================
-- 004: Service Orders
-- =====================================================

create table public.service_orders (
  id                  uuid primary key default uuid_generate_v4(),
  os_number           text not null unique,            -- OS-2024-0001
  shop_id             uuid not null references public.shops(id) on delete cascade,
  provider_id         uuid references public.service_providers(id),
  status              os_status not null default 'draft',
  service_type        service_type not null,
  title               text not null,
  description         text,
  -- Endereço
  address_full        text not null,
  address_city        text not null,
  address_state       text not null,
  address_zip         text,
  location            geography(Point, 4326),
  -- Agendamento
  scheduled_date      date,
  scheduled_time      time,
  estimated_hours     numeric(4,1),
  -- Financeiro
  budget              numeric(10,2),
  material_provided   boolean not null default false,
  -- Notas
  notes_internal      text,   -- visível só para lojista
  notes_provider      text,   -- visível para prestador
  -- Rastreamento
  distributed_at      timestamptz,
  accepted_at         timestamptz,
  started_at          timestamptz,
  completed_at        timestamptz,
  cancelled_at        timestamptz,
  cancelled_reason    text,
  -- Metadados
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Sequência para OS number
create sequence os_number_seq start 1;

create or replace function generate_os_number()
returns trigger as $$
begin
  new.os_number := 'OS-' || extract(year from now()) || '-' || lpad(nextval('os_number_seq')::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_os_number
  before insert on public.service_orders
  for each row
  when (new.os_number is null or new.os_number = '')
  execute function generate_os_number();

create trigger os_updated_at
  before update on public.service_orders
  for each row execute function update_updated_at();

-- Índices
create index os_shop_id_idx      on public.service_orders(shop_id);
create index os_provider_id_idx  on public.service_orders(provider_id);
create index os_status_idx       on public.service_orders(status);
create index os_location_idx     on public.service_orders using gist(location);
create index os_scheduled_idx    on public.service_orders(scheduled_date);
create index os_created_at_idx   on public.service_orders(created_at desc);

-- Full-text search
create index os_search_idx on public.service_orders
  using gin(to_tsvector('portuguese', title || ' ' || coalesce(description, '')));

-- RLS
alter table public.service_orders enable row level security;

create policy "Lojista vê próprias OS"
  on public.service_orders for select
  using (
    shop_id in (
      select id from public.shops where user_id = auth.uid()
    )
  );

create policy "Lojista cria OS"
  on public.service_orders for insert
  with check (
    shop_id in (
      select id from public.shops where user_id = auth.uid()
    )
  );

create policy "Lojista atualiza próprias OS"
  on public.service_orders for update
  using (
    shop_id in (
      select id from public.shops where user_id = auth.uid()
    )
  );

create policy "Prestador vê OS aceitas e em execução"
  on public.service_orders for select
  using (
    provider_id in (
      select id from public.service_providers where user_id = auth.uid()
    )
  );

create policy "Prestador atualiza OS aceitas"
  on public.service_orders for update
  using (
    provider_id in (
      select id from public.service_providers where user_id = auth.uid()
    )
    and status in ('accepted', 'in_progress')
  );

create policy "Admin acessa todas as OS"
  on public.service_orders for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );
