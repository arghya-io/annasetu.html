-- =========================================================
-- 0004_grants_and_checkin.sql
--
-- Two things in this pass:
--
-- 1. PERMISSION FIX
--    0002 already turns on RLS with "allow everything" policies,
--    but a permissive RLS policy is not enough on its own — Postgres
--    still checks plain table GRANTs first, and rows created via the
--    Supabase SQL editor don't automatically get anon/authenticated
--    GRANTs unless the project's default privileges were configured
--    for them. That combination is exactly what produces
--    "permission denied for table X" even though the policy says
--    `using (true)`. This migration grants the anon/authenticated
--    roles explicit access on every existing table/view, and sets
--    default privileges so any table added later gets the same
--    access automatically.
--
-- 2. CENTER CHECK-IN / WEIGH-IN WORKFLOW
--    The procurement-center admin (the person staffing the physical
--    check-in counter — NOT a government official) needs to:
--      a) see every farmer's booking, exactly as the farmer booked it
--         (an *approximate* quantity given at booking time), and
--      b) when the farmer physically arrives with produce, weigh it,
--         enter the *actual* measured quantity/grade/moisture, and
--         only then mark the booking "confirmed".
--    `bookings.quantity_quintal` stays the farmer's approximate,
--    booking-time figure. New columns below hold what the admin
--    measures on site. Status now models that lifecycle explicitly.
--
--    Also removes the placeholder demo rows from 0003 so the admin
--    portal starts from a clean, real state, and seeds the three
--    procurement centers the farmer-facing app already lets a
--    farmer pick from (Central/North/South) so real bookings have
--    somewhere to resolve to.
-- =========================================================

-- ---------------------------------------------------------
-- 1. GRANTS — fixes "permission denied for table ..."
-- ---------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
  on all tables in schema public
  to anon, authenticated;

grant select, insert, update, delete
  on all sequences in schema public
  to anon, authenticated;

-- so future tables/sequences (created by later migrations) inherit
-- the same access automatically, without needing a 0005 just for grants
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on sequences to anon, authenticated;

-- ---------------------------------------------------------
-- 2. BOOKINGS — check-in / weigh-in columns
-- ---------------------------------------------------------
alter table bookings
  add column if not exists actual_quantity_quintal numeric(8,2),
  add column if not exists quality_grade text,
  add column if not exists moisture_percent numeric(5,2),
  add column if not exists checked_in_at timestamptz,
  add column if not exists confirmed_at timestamptz,
  add column if not exists inspected_by uuid references admins(id) on delete set null,
  add column if not exists inspection_notes text;

alter table bookings
  drop constraint if exists bookings_quality_grade_check;
alter table bookings
  add constraint bookings_quality_grade_check
  check (quality_grade is null or quality_grade in ('A','B','C'));

comment on column bookings.quantity_quintal is
  'Approximate quantity the farmer declared at booking time.';
comment on column bookings.actual_quantity_quintal is
  'Actual measured quantity, entered by the center admin after weighing on arrival.';

-- New status lifecycle:
--   booked      -> farmer reserved a slot with an approximate quantity (default)
--   checked_in  -> farmer has physically arrived at the center
--   confirmed   -> admin has weighed the produce, entered actual figures, and confirmed
--   cancelled / no_show -> booking did not result in a procurement
-- (previous builds defaulted new bookings straight to 'confirmed', which
-- really just meant "booked" — those rows are migrated below.)
update bookings set status = 'booked' where status = 'confirmed' and actual_quantity_quintal is null;

alter table bookings drop constraint if exists bookings_status_check;
alter table bookings
  add constraint bookings_status_check
  check (status in ('booked','checked_in','confirmed','cancelled','no_show'));

alter table bookings alter column status set default 'booked';

-- ---------------------------------------------------------
-- Slot occupancy trigger — rewritten for the new status set.
-- A slot seat is considered occupied by any booking that hasn't
-- been cancelled or marked no-show (booked/checked_in/confirmed
-- all still hold the seat).
-- ---------------------------------------------------------
create or replace function trg_bookings_adjust_slot_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    if new.status not in ('cancelled','no_show') then
      update procurement_slots set booked_count = booked_count + 1 where id = new.slot_id;
    end if;
    return new;
  elsif tg_op = 'UPDATE' then
    if old.status not in ('cancelled','no_show') and new.status in ('cancelled','no_show') then
      update procurement_slots set booked_count = greatest(booked_count - 1, 0) where id = old.slot_id;
    elsif old.status in ('cancelled','no_show') and new.status not in ('cancelled','no_show') then
      update procurement_slots set booked_count = booked_count + 1 where id = new.slot_id;
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    if old.status not in ('cancelled','no_show') then
      update procurement_slots set booked_count = greatest(booked_count - 1, 0) where id = old.slot_id;
    end if;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

-- ---------------------------------------------------------
-- Transaction history view — expose declared vs. actual figures
-- and the check-in/confirm timestamps to the admin dashboard.
-- ---------------------------------------------------------
create or replace view vw_transaction_history as
select
  b.id as booking_id,
  b.booking_code,
  f.id as farmer_id,
  f.name as farmer_name,
  f.mobile_number,
  c.name as crop_name,
  pc.name as center_name,
  b.quantity_quintal as declared_quantity_quintal,
  b.actual_quantity_quintal,
  b.quality_grade,
  b.moisture_percent,
  b.status as booking_status,
  b.checked_in_at,
  b.confirmed_at,
  t.token_number,
  t.status as token_status,
  p.amount,
  p.payment_method,
  p.payment_status,
  p.paid_at,
  b.created_at as booked_at
from bookings b
join farmers f on f.id = b.farmer_id
join crops c on c.id = b.crop_id
join procurement_centers pc on pc.id = b.center_id
left join tokens t on t.booking_id = b.id
left join payments p on p.booking_id = b.id
order by b.created_at desc;

-- ---------------------------------------------------------
-- 3. CLEAN UP PLACEHOLDER/MOCK DATA FROM 0003
-- Wrapped so that if you've already created real bookings/admins
-- against one of these rows, the cleanup is skipped for that row
-- instead of failing the whole migration.
-- ---------------------------------------------------------
do $$
begin
  delete from admins where admin_code = 'admin' and name = 'Default Admin';
exception when foreign_key_violation then
  raise notice 'Skipped deleting the demo admin — it is referenced by other data.';
end $$;

do $$
begin
  delete from farmers where mobile_number = '9876543210' and name = 'Demo Farmer';
exception when foreign_key_violation then
  raise notice 'Skipped deleting the demo farmer — it has real bookings.';
end $$;

do $$
begin
  delete from procurement_centers where name = 'Central Procurement Center' and address = '123 Mandi Road';
exception when foreign_key_violation then
  raise notice 'Skipped deleting the demo center — it has real bookings/slots/admins.';
end $$;

-- Real procurement centers matching the options the farmer-facing
-- app already presents (Feature 02 center dropdown), so bookings
-- made from the live app resolve to a real row instead of a mock one.
alter table procurement_centers
  drop constraint if exists procurement_centers_name_key;
alter table procurement_centers
  add constraint procurement_centers_name_key unique (name);

insert into procurement_centers (name, daily_capacity) values
  ('Central Procurement Center', 200),
  ('North Procurement Center', 150),
  ('South Procurement Center', 150)
on conflict (name) do nothing;
