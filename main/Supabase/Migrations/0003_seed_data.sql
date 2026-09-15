-- =========================================================
-- 0003_seed_data.sql
-- Starter data matching what the frontend already assumes.
-- Safe to re-run (uses ON CONFLICT DO NOTHING).
-- =========================================================

-- Crops — matches the live cropMspData list now synced from /api/msp
-- (official CACP snapshot, with the same fallback prices as api/msp.js).
insert into crops (name, icon, season, status, msp_price) values
  ('Rice',      '🌾', 'kharif', 'MSP Declared', 2441),
  ('Jute',      '🌿', 'commercial', 'MSP Declared', 5925),
  ('Maize',     '🌽', 'kharif', 'MSP Declared', 2410),
  ('Wheat',     '🌾', 'rabi',   'MSP Declared', 2585),
  ('Mustard',   '🌱', 'rabi',   'MSP Declared', 6200),
  ('Groundnut', '🥜', 'kharif', 'MSP Declared', 7517),
  ('Sunflower', '🌻', 'kharif', 'MSP Declared', 8343),
  ('Gram',      '🫘', 'rabi',   'MSP Declared', 5875)
on conflict (name) do nothing;

-- The one demo farmer the current mock login treats as "existing".
insert into farmers (mobile_number, name, village, district, state) values
  ('9876543210', 'Demo Farmer', 'Demo Village', 'Demo District', 'Demo State')
on conflict (mobile_number) do nothing;

-- A starter admin profile + procurement center so the admin
-- portal isn't empty on first load.
insert into procurement_centers (name, address, district, state, daily_capacity) values
  ('Central Procurement Center', '123 Mandi Road', 'Demo District', 'Demo State', 100)
on conflict do nothing;

insert into admins (admin_code, name, role)
select 'admin', 'Default Admin', 'super_admin'
where not exists (select 1 from admins where admin_code = 'admin');
