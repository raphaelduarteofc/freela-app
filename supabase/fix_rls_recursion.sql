-- =============================================================
-- FIX: Recursão infinita nas políticas RLS
-- Causa: policies que fazem SELECT FROM public.users dentro
--        de uma policy da própria tabela users causam loop.
-- Solução: função SECURITY DEFINER que bypassa RLS.
-- =============================================================

-- 1. Função helper que verifica admin SEM triggerar RLS
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

-- 2. Função helper que retorna o role do usuário atual SEM triggerar RLS
create or replace function public.current_user_role()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  select role::text into v_role
  from public.users
  where id = auth.uid();
  return v_role;
end;
$$;

-- =============================================================
-- TABELA: public.users
-- =============================================================
drop policy if exists "Admin vê todos os usuários" on public.users;

create policy "Admin vê todos os usuários"
  on public.users for select
  using (public.is_admin());

-- =============================================================
-- TABELA: public.shops
-- =============================================================
drop policy if exists "Admin vê todas as lojas" on public.shops;
drop policy if exists "Admin acesso total shops" on public.shops;

create policy "Admin vê todas as lojas"
  on public.shops for select
  using (public.is_admin());

create policy "Admin acesso total shops"
  on public.shops for all
  using (public.is_admin());

-- =============================================================
-- TABELA: public.service_providers
-- =============================================================
drop policy if exists "Admin vê todos os prestadores" on public.service_providers;
drop policy if exists "Admin acesso total providers" on public.service_providers;

create policy "Admin vê todos os prestadores"
  on public.service_providers for select
  using (public.is_admin());

create policy "Admin acesso total providers"
  on public.service_providers for all
  using (public.is_admin());

-- =============================================================
-- TABELA: public.service_orders
-- =============================================================
drop policy if exists "Admin vê todas as OS" on public.service_orders;
drop policy if exists "Admin acesso total" on public.service_orders;

create policy "Admin vê todas as OS"
  on public.service_orders for select
  using (public.is_admin());

create policy "Admin acesso total"
  on public.service_orders for all
  using (public.is_admin());

-- =============================================================
-- TABELAS: os_invitations, os_executions, ratings, etc.
-- =============================================================
drop policy if exists "Admin acesso total invitations" on public.os_invitations;
drop policy if exists "Admin acesso total executions" on public.os_executions;
drop policy if exists "Admin acesso total ratings" on public.ratings;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'os_invitations',
    'os_executions',
    'ratings',
    'os_photos',
    'notifications',
    'financial_transactions'
  ] loop
    begin
      execute format(
        'create policy "Admin acesso total %I" on public.%I for all using (public.is_admin())',
        tbl, tbl
      );
    exception when others then
      -- tabela pode não existir ainda, ignora
      null;
    end;
  end loop;
end;
$$;

-- =============================================================
-- Verificação final: testa se a query na users funciona
-- =============================================================
select id, email, role from public.users limit 5;
