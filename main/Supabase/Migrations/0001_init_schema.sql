-- =========================================================
-- 0001_init_schema.sql
-- Crop Procurement Portal — core schema
-- Covers: Farmers, Admins, Feature 01–06
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- Helper: shared updated_at trigger
-- ---------------------------------------------------------
create or replace function trg_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------
-- FARMERS
-- ---------------------------------------------------------
create table if not exists farmers (
  id uuid primary key default gen_random_uuid(),
  mobile_number text not null unique check (mobile_number ~ '^[0-9]{10}$'),
  name text not null,
  village text,
  district text,
  state text,
  auth_user_id uuid, -- reserved: link to auth.users once real auth is added
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on farmers
  for each row execute function trg_set_updated_at();

-- ---------------------------------------------------------
-- PROCUREMENT CENTERS (Feature 02)
-- ---------------------------------------------------------
create table if not exists procurement_centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  district text,
  state text,
  daily_capacity integer not null default 0 check (daily_capacity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on procurement_centers
  for each row execute function trg_set_updated_at();

-- ---------------------------------------------------------
-- ADMINS / OPERATORS
-- NOTE: login stays mocked on the frontend (per current build).
-- This table only stores admin profile/role, not credentials.
-- When real auth is added, link via auth_user_id instead.
-- ---------------------------------------------------------
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  admin_code text not null unique,
  name text not null,
  role text not null default 'operator' check (role in ('super_admin','operator')),
  center_id uuid references procurement_centers(id) on delete set null,
  auth_user_id uuid, -- reserved for real auth
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on admins
  for each row execute function trg_set_updated_at();

-- ---------------------------------------------------------
-- CROPS & MSP (Feature 01)
-- ---------------------------------------------------------
create table if not exists crops (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text default '🌾',
  season text not null check (season in ('kharif','rabi','zaid','commercial')),
  msp_price numeric(10,2), -- null = not yet published (shown as ₹— on frontend)
  unit text not null default 'quintal',
  status text not null default 'Procurement Open',
  procurement_start date,
  procurement_end date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on crops
  for each row execute function trg_set_updated_at();

-- ---------------------------------------------------------
-- PROCUREMENT SLOTS (Feature 02)
-- ---------------------------------------------------------
create table if not exists procurement_slots (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references procurement_centers(id) on delete cascade,
  slot_date date not null,
  slot_time time not null,
  capacity integer not null default 20 check (capacity >= 0),
  booked_count integer not null default 0 check (booked_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (center_id, slot_date, slot_time)
);
create trigger set_updated_at before update on procurement_slots
  for each row execute function trg_set_updated_at();

-- ---------------------------------------------------------
-- BOOKINGS (Feature 02)
-- ---------------------------------------------------------
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  farmer_id uuid not null references farmers(id) on delete cascade,
  crop_id uuid not null references crops(id),
  center_id uuid not null references procurement_centers(id),
  slot_id uuid not null references procurement_slots(id),
  quantity_quintal numeric(8,2) not null check (quantity_quintal > 0),
  status text not null default 'confirmed' check (status in ('confirmed','cancelled','completed','no_show')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_bookings_farmer on bookings(farmer_id);
create index if not exists idx_bookings_slot on bookings(slot_id);
create trigger set_updated_at before update on bookings
  for each row execute function trg_set_updated_at();

-- keep procurement_slots.booked_count accurate as bookings change
create or replace function trg_bookings_adjust_slot_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'confirmed' then
      update procurement_slots set booked_count = booked_count + 1 where id = new.slot_id;
    end if;
    return new;
  elsif tg_op = 'UPDATE' then
    if old.status = 'confirmed' and new.status <> 'confirmed' then
      update procurement_slots set booked_count = greatest(booked_count - 1, 0) where id = old.slot_id;
    elsif old.status <> 'confirmed' and new.status = 'confirmed' then
      update procurement_slots set booked_count = booked_count + 1 where id = new.slot_id;
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    if old.status = 'confirmed' then
      update procurement_slots set booked_count = greatest(booked_count - 1, 0) where id = old.slot_id;
    end if;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger bookings_adjust_slot_count
  after insert or update or delete on bookings
  for each row execute function trg_bookings_adjust_slot_count();

-- ---------------------------------------------------------
-- PRODUCE REGISTRATIONS (Feature 03)
-- ---------------------------------------------------------
create table if not exists produce_registrations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  crop_id uuid not null references crops(id),
  quantity_quintal numeric(8,2) not null check (quantity_quintal > 0),
  quality_grade text not null default 'A' check (quality_grade in ('A','B','C')),
  moisture_percent numeric(5,2),
  registered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_produce_reg_booking on produce_registrations(booking_id);
create trigger set_updated_at before update on produce_registrations
  for each row execute function trg_set_updated_at();

-- ---------------------------------------------------------
-- TOKENS / LIVE QUEUE (Feature 04)
-- ---------------------------------------------------------
create table if not exists tokens (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings(id) on delete cascade,
  center_id uuid not null references procurement_centers(id),
  token_number integer not null,
  status text not null default 'waiting' check (status in ('waiting','called','in_progress','completed','skipped')),
  congestion_level text not null default 'low' check (congestion_level in ('low','medium','high')),
  issued_at timestamptz not null default now(),
  called_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tokens_center on tokens(center_id, status);
create trigger set_updated_at before update on tokens
  for each row execute function trg_set_updated_at();

-- ---------------------------------------------------------
-- PAYMENTS (Feature 05)
-- ---------------------------------------------------------
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  farmer_id uuid not null references farmers(id),
  amount numeric(12,2) not null check (amount >= 0),
  payment_method text not null default 'bank_transfer' check (payment_method in ('bank_transfer','upi','cash','cheque')),
  payment_status text not null default 'pending' check (payment_status in ('pending','processing','paid','failed')),
  transaction_ref text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_payments_farmer on payments(farmer_id);
create trigger set_updated_at before update on payments
  for each row execute function trg_set_updated_at();

-- ---------------------------------------------------------
-- TRANSACTION HISTORY (Feature 06) — read-only view
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
  b.quantity_quintal,
  b.status as booking_status,
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
