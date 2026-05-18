-- =====================================================
-- 005: Invitations, Executions, Photos, Ratings
-- =====================================================

-- Convites de OS
create table public.os_invitations (
  id              uuid primary key default uuid_generate_v4(),
  os_id           uuid not null references public.service_orders(id) on delete cascade,
  provider_id     uuid not null references public.service_providers(id) on delete cascade,
  status          inv_status not null default 'pending',
  score           numeric(5,2) not null default 0,
  message         text,
  sent_at         timestamptz not null default now(),
  responded_at    timestamptz,
  expires_at      timestamptz default (now() + interval '24 hours'),
  unique(os_id, provider_id)
);

create index inv_os_id_idx       on public.os_invitations(os_id);
create index inv_provider_id_idx on public.os_invitations(provider_id);
create index inv_status_idx      on public.os_invitations(status);

alter table public.os_invitations enable row level security;

create policy "Lojista vê convites das suas OS"
  on public.os_invitations for select
  using (
    os_id in (
      select id from public.service_orders os
      join public.shops s on s.id = os.shop_id
      where s.user_id = auth.uid()
    )
  );

create policy "Prestador vê convites para ele"
  on public.os_invitations for select
  using (
    provider_id in (
      select id from public.service_providers where user_id = auth.uid()
    )
  );

create policy "Prestador responde convite"
  on public.os_invitations for update
  using (
    provider_id in (
      select id from public.service_providers where user_id = auth.uid()
    )
    and status = 'pending'
  );

-- =====================================================

-- Execuções de OS (check-in / check-out)
create table public.os_executions (
  id                  uuid primary key default uuid_generate_v4(),
  os_id               uuid not null unique references public.service_orders(id) on delete cascade,
  provider_id         uuid not null references public.service_providers(id),
  check_in_at         timestamptz,
  check_in_location   geography(Point, 4326),
  check_out_at        timestamptz,
  check_out_location  geography(Point, 4326),
  notes               text,
  created_at          timestamptz not null default now()
);

create index exec_os_id_idx on public.os_executions(os_id);

alter table public.os_executions enable row level security;

create policy "Partes envolvidas veem execução"
  on public.os_executions for select
  using (
    provider_id in (select id from public.service_providers where user_id = auth.uid())
    or os_id in (
      select id from public.service_orders os
      join public.shops s on s.id = os.shop_id
      where s.user_id = auth.uid()
    )
  );

create policy "Prestador registra execução"
  on public.os_executions for insert
  with check (
    provider_id in (select id from public.service_providers where user_id = auth.uid())
  );

create policy "Prestador atualiza execução"
  on public.os_executions for update
  using (
    provider_id in (select id from public.service_providers where user_id = auth.uid())
  );

-- =====================================================

-- Fotos das OS
create table public.os_photos (
  id            uuid primary key default uuid_generate_v4(),
  os_id         uuid not null references public.service_orders(id) on delete cascade,
  uploader_id   uuid not null references public.users(id),
  phase         photo_phase not null,
  storage_path  text not null,
  caption       text,
  created_at    timestamptz not null default now()
);

create index photos_os_id_idx on public.os_photos(os_id);

alter table public.os_photos enable row level security;

create policy "Partes envolvidas veem fotos"
  on public.os_photos for select
  using (
    uploader_id = auth.uid()
    or os_id in (
      select id from public.service_orders os
      join public.shops s on s.id = os.shop_id
      where s.user_id = auth.uid()
    )
  );

create policy "Partes envolvidas fazem upload"
  on public.os_photos for insert
  with check (uploader_id = auth.uid());

-- =====================================================

-- Avaliações
create table public.ratings (
  id          uuid primary key default uuid_generate_v4(),
  os_id       uuid not null references public.service_orders(id) on delete cascade,
  rater_id    uuid not null references public.users(id),
  rated_id    uuid not null references public.users(id),
  score       integer not null check (score between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique(os_id, rater_id)
);

create index ratings_os_id_idx   on public.ratings(os_id);
create index ratings_rated_id_idx on public.ratings(rated_id);

alter table public.ratings enable row level security;

create policy "Avaliação visível para partes envolvidas"
  on public.ratings for select
  using (
    rater_id = auth.uid() or rated_id = auth.uid()
    or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy "Avaliador pode criar avaliação"
  on public.ratings for insert
  with check (rater_id = auth.uid());

-- Trigger: atualiza rating do prestador ao criar avaliação
create or replace function update_provider_rating()
returns trigger as $$
declare
  provider_user_id uuid;
  new_rating numeric;
  new_count integer;
begin
  -- Pega o user_id do prestador avaliado
  select user_id into provider_user_id
  from public.service_providers
  where user_id = new.rated_id;

  if provider_user_id is not null then
    select avg(score)::numeric(3,2), count(*)
    into new_rating, new_count
    from public.ratings r
    join public.service_orders os on os.id = r.os_id
    join public.service_providers sp on sp.id = os.provider_id
    where sp.user_id = new.rated_id;

    update public.service_providers
    set rating = new_rating, rating_count = new_count
    where user_id = new.rated_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_rating_created
  after insert on public.ratings
  for each row execute function update_provider_rating();
