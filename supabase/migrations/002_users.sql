-- =====================================================
-- 002: Users table (espelho do auth.users)
-- =====================================================

create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null unique,
  phone        text,
  full_name    text not null,
  avatar_url   text,
  role         user_role not null,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Índices
create index users_role_idx on public.users(role);
create index users_email_idx on public.users(email);

-- Trigger: updated_at automático
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

-- Trigger: auto-criar user após signup no auth
create or replace function handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'lojista')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- RLS
alter table public.users enable row level security;

create policy "Users podem ver próprio perfil"
  on public.users for select
  using (auth.uid() = id);

create policy "Users podem atualizar próprio perfil"
  on public.users for update
  using (auth.uid() = id);

create policy "Admin vê todos os usuários"
  on public.users for select
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );
