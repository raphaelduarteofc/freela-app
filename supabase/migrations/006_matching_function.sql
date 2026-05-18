-- =====================================================
-- 006: Matching Score Function
-- =====================================================
-- Score = (Rating×0.25) + (Proximidade×0.25) + (Conclusão×0.20) +
--         (Cert Level×0.15) + (Disponibilidade×0.10) + (Histórico×0.05)

create or replace function public.calculate_provider_score(
  p_provider_id uuid,
  p_os_lat      float,
  p_os_lng      float
) returns numeric as $$
declare
  v_provider    record;
  v_dist_km     numeric;
  v_dist_score  numeric;
  v_cert_score  numeric;
  v_avail_score numeric;
  v_history_score numeric;
  v_total_score numeric;
begin
  select
    rating,
    completion_rate,
    cert_level,
    is_available,
    radius_km,
    st_distance(
      location,
      st_setsrid(st_makepoint(p_os_lng, p_os_lat), 4326)::geography
    ) / 1000 as dist_km
  into v_provider
  from public.service_providers
  where id = p_provider_id and is_active = true;

  if not found then return 0; end if;

  -- Distância score (normalizado pelo raio do prestador)
  v_dist_km := coalesce(v_provider.dist_km, 999);
  if v_dist_km > v_provider.radius_km then return 0; end if;  -- fora do raio
  v_dist_score := 1 - (v_dist_km / v_provider.radius_km);

  -- Certificação score
  v_cert_score := case v_provider.cert_level
    when 'bronze'   then 0.25
    when 'prata'    then 0.50
    when 'ouro'     then 0.75
    when 'diamante' then 1.00
    else 0
  end;

  -- Disponibilidade score
  v_avail_score := case when v_provider.is_available then 1.0 else 0.3 end;

  -- Histórico com a loja (simplificado — OS concluídas juntos)
  select coalesce(
    count(os.id)::numeric / nullif((select count(*) from public.service_orders s2 where s2.provider_id = p_provider_id), 0),
    0
  ) into v_history_score
  from public.service_orders os
  where os.provider_id = p_provider_id
  and os.status = 'completed';

  -- Score final ponderado
  v_total_score :=
    (v_provider.rating / 5.0)      * 0.25 +
    v_dist_score                   * 0.25 +
    v_provider.completion_rate     * 0.20 +
    v_cert_score                   * 0.15 +
    v_avail_score                  * 0.10 +
    v_history_score                * 0.05;

  return round(v_total_score * 100, 2);  -- retorna 0-100
end;
$$ language plpgsql stable;

-- Função para distribuir OS (busca top N prestadores)
create or replace function public.distribute_service_order(
  p_os_id uuid,
  p_limit  integer default 5
) returns table(provider_id uuid, score numeric) as $$
declare
  v_os record;
  v_lat float;
  v_lng float;
begin
  select *, st_y(location::geometry) as lat, st_x(location::geometry) as lng
  into v_os
  from public.service_orders
  where id = p_os_id;

  if not found then raise exception 'OS % não encontrada', p_os_id; end if;

  v_lat := v_os.lat;
  v_lng := v_os.lng;

  return query
  select
    sp.id as provider_id,
    calculate_provider_score(sp.id, v_lat, v_lng) as score
  from public.service_providers sp
  where sp.is_active = true
  and sp.is_available = true
  and calculate_provider_score(sp.id, v_lat, v_lng) > 0
  order by score desc
  limit p_limit;
end;
$$ language plpgsql stable;
