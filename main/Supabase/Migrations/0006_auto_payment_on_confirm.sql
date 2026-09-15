-- =========================================================
-- 0006_auto_payment_on_confirm.sql
--
-- 1. AUTOMATIC "ON HOLD" PAYMENT
--    When the center admin finishes Check-in & Weigh and marks a
--    booking "confirmed", a payments row should exist immediately
--    with payment_status = 'pending' (amount = weighed quantity x
--    that crop's MSP), so the farmer app's Payment/Transaction
--    screens have something real to show right away, and the
--    center/finance side has a single "pending" queue that a UPI
--    integration can later flip to 'paid'. This fires as a DB
--    trigger so it happens no matter which client (admin.js today,
--    anything else later) performs the confirm.
--
--    Guards against duplicates: only fires the first time a booking
--    transitions INTO 'confirmed' (re-weighing an already-confirmed
--    booking does not insert a second payment row), and double-checks
--    no payment already exists for the booking.
--
-- 2. vw_transaction_history — add crops.msp_price so the farmer app
--    can show "MSP per Quintal" without a second query.
-- =========================================================

create or replace function trg_bookings_create_pending_payment()
returns trigger as $$
declare
  v_msp numeric(10,2);
  v_qty numeric(8,2);
  v_amount numeric(12,2);
begin
  if new.status = 'confirmed' and (old.status is distinct from 'confirmed') then
    if not exists (select 1 from payments where booking_id = new.id) then
      select msp_price into v_msp from crops where id = new.crop_id;
      v_qty := coalesce(new.actual_quantity_quintal, new.quantity_quintal);
      v_amount := round(coalesce(v_qty, 0) * coalesce(v_msp, 0), 2);

      insert into payments (booking_id, farmer_id, amount, payment_method, payment_status)
      values (new.id, new.farmer_id, v_amount, 'upi', 'pending');
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_bookings_payment_on_confirm on bookings;
create trigger trg_bookings_payment_on_confirm
  after update on bookings
  for each row execute function trg_bookings_create_pending_payment();

-- ---------------------------------------------------------
-- vw_transaction_history — add MSP rate
-- ---------------------------------------------------------
create or replace view vw_transaction_history as
select
  b.id as booking_id,
  b.booking_code,
  f.id as farmer_id,
  f.name as farmer_name,
  f.mobile_number,
  c.name as crop_name,
  c.msp_price,
  pc.name as center_name,
  pc.id as center_id,
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
