-- =========================================================
-- 0005_relax_mobile_number_check.sql
--
-- 0001 constrained farmers.mobile_number to exactly 10 digits
-- (^[0-9]{10}$). That's too strict for real-world input (numbers
-- entered with a leading "+", country code, or non-10-digit
-- formats), and it silently rejects inserts from the farmer app
-- with a Postgres check-constraint error.
--
-- Relaxes it to 7-15 digits with an optional leading "+", and
-- loosens the matching JS-side validation in script.js
-- (see the app's invalidMobile / mobile regex checks).
-- =========================================================

alter table public.farmers
  drop constraint if exists farmers_mobile_number_check;

alter table public.farmers
  add constraint farmers_mobile_number_check
  check (mobile_number ~ '^\+?[0-9]{7,15}$');
