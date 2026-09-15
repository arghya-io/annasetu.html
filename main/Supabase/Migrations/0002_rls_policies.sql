-- =========================================================
-- 0002_rls_policies.sql
--
-- IMPORTANT — READ BEFORE DEPLOYING TO PRODUCTION
--
-- The frontend login (farmer OTP + admin ID/password) is still
-- the MOCK demo flow from the original build: it never creates a
-- real Supabase Auth session. Because of that, Postgres has no
-- auth.uid() to check policies against.
--
-- These policies are intentionally PERMISSIVE (anon role gets full
-- read/write) so the admin portal works today. This is safe only
-- while the anon key is not public (e.g. an internal/staging tool).
-- Before real users touch this, replace these policies with ones
-- scoped to authenticated admins/farmers once Supabase Auth (or
-- another real auth layer) is wired up. Search this file for
-- "TODO(auth)" for every policy that needs tightening.
-- =========================================================

alter table farmers enable row level security;
alter table admins enable row level security;
alter table procurement_centers enable row level security;
alter table crops enable row level security;
alter table procurement_slots enable row level security;
alter table bookings enable row level security;
alter table produce_registrations enable row level security;
alter table tokens enable row level security;
alter table payments enable row level security;

-- TODO(auth): scope to authenticated admins only
create policy "anon full access - farmers" on farmers
  for all using (true) with check (true);

-- TODO(auth): scope to authenticated super_admins only
create policy "anon full access - admins" on admins
  for all using (true) with check (true);

-- TODO(auth): writes should require admin; reads can stay public
create policy "anon full access - procurement_centers" on procurement_centers
  for all using (true) with check (true);

-- TODO(auth): writes should require admin; reads can stay public
create policy "anon full access - crops" on crops
  for all using (true) with check (true);

-- TODO(auth): writes should require admin; reads can stay public
create policy "anon full access - procurement_slots" on procurement_slots
  for all using (true) with check (true);

-- TODO(auth): a farmer should only see/write their own bookings;
-- an admin should see/write all. Needs real auth.uid() mapping.
create policy "anon full access - bookings" on bookings
  for all using (true) with check (true);

-- TODO(auth): scope to the owning farmer + admins
create policy "anon full access - produce_registrations" on produce_registrations
  for all using (true) with check (true);

-- TODO(auth): scope to the owning farmer + admins
create policy "anon full access - tokens" on tokens
  for all using (true) with check (true);

-- TODO(auth): scope to the owning farmer + admins
create policy "anon full access - payments" on payments
  for all using (true) with check (true);
