insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('saahirides-media','saahirides-media',true,10485760,array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Public can view SaahiRides media" on storage.objects;
create policy "Public can view SaahiRides media" on storage.objects for select using (bucket_id='saahirides-media');

drop policy if exists "SaahiRides admins and HR upload media" on storage.objects;
create policy "SaahiRides admins and HR upload media" on storage.objects for insert to authenticated with check (bucket_id='saahirides-media' and (public.is_saahirides_admin() or public.is_saahirides_hr_publisher()));

drop policy if exists "SaahiRides admins and HR update media" on storage.objects;
create policy "SaahiRides admins and HR update media" on storage.objects for update to authenticated using (bucket_id='saahirides-media' and (public.is_saahirides_admin() or public.is_saahirides_hr_publisher())) with check (bucket_id='saahirides-media' and (public.is_saahirides_admin() or public.is_saahirides_hr_publisher()));

drop policy if exists "SaahiRides admins and HR delete media" on storage.objects;
create policy "SaahiRides admins and HR delete media" on storage.objects for delete to authenticated using (bucket_id='saahirides-media' and (public.is_saahirides_admin() or public.is_saahirides_hr_publisher()));
