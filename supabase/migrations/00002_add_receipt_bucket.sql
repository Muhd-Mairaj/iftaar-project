-- Create the receipts bucket for donation proofs
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false);

-- Allow public receipt uploads (INSERT)
-- This is necessary so that non-logged in users can submit the donation form
create policy "Allow public receipt uploads"
on storage.objects for insert
with check ( bucket_id = 'receipts' );

-- Allow muazzins to view receipts (SELECT)
-- We use the authenticated role and check against the profile/role logic if needed,
-- but for storage policies, authenticated is usually enough for muazzins who are logged in.
create policy "Muazzins can view receipts"
on storage.objects for select
to authenticated
using ( bucket_id = 'receipts' );
