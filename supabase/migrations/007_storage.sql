-- =====================================================
-- 007: Storage Buckets
-- =====================================================

-- Avatares dos usuários
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars', 'avatars', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
);

-- Fotos das OS
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'os-photos', 'os-photos', true, 20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Documentos (certificações, contratos)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents', 'documents', false, 10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
);

-- Políticas de Storage

-- Avatares: público read, dono write
create policy "Avatares são públicos"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Usuário faz upload do próprio avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Usuário atualiza próprio avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Fotos de OS: público read, autenticado write
create policy "Fotos de OS são públicas"
  on storage.objects for select
  using (bucket_id = 'os-photos');

create policy "Autenticado faz upload de foto"
  on storage.objects for insert
  with check (
    bucket_id = 'os-photos'
    and auth.role() = 'authenticated'
  );

-- Documentos: só o dono
create policy "Dono acessa próprio documento"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Dono faz upload de documento"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
