-- =====================================================
-- 001: Extensions & ENUMs
-- =====================================================

-- PostGIS para geolocalização
create extension if not exists postgis;
-- UUID geração
create extension if not exists "uuid-ossp";
-- Full-text search
create extension if not exists pg_trgm;

-- ENUMs
create type user_role     as enum ('lojista', 'prestador', 'fabricante', 'admin');
create type os_status     as enum ('draft', 'open', 'distributed', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed');
create type service_type  as enum ('installation', 'repair', 'removal', 'inspection', 'cleaning');
create type cert_level    as enum ('bronze', 'prata', 'ouro', 'diamante');
create type inv_status    as enum ('pending', 'accepted', 'rejected', 'expired');
create type photo_phase   as enum ('before', 'during', 'after');
