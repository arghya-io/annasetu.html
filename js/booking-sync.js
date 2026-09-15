// /js/booking-sync.js
//
// script.js (the farmer-facing app) is a plain classic script, not a
// module, so it can't `import` the Supabase client directly. This
// module does the real Supabase reads/writes for the farmer flow
// (farmer profile, and turning a booking into a real row in the
// `bookings` table) and exposes them on `window.AnnasetuSync` so
// script.js can call them from its existing event handlers.
//
// Without this, "Confirm Reservation" only ever wrote to
// localStorage — the booking never existed in Supabase, so it could
// never show up in the admin portal. Every function below is the
// real thing: no mock/sample data, no localStorage-only fallback.

import { getSupabaseClient } from "./supabase-client.js";

const SLOT_TIMES = {
  morning: "09:00:00",
  afternoon: "14:00:00",
};

async function findFarmerByMobile(mobile) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("mobile_number", mobile)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function upsertFarmer({ mobile, name, village, district, state }) {
  const supabase = await getSupabaseClient();
  const existing = await findFarmerByMobile(mobile);
  if (existing) {
    const patch = {};
    if (name && !existing.name) patch.name = name;
    if (village && !existing.village) patch.village = village;
    if (district && !existing.district) patch.district = district;
    if (Object.keys(patch).length === 0) return existing;
    const { data, error } = await supabase
      .from("farmers")
      .update(patch)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase
    .from("farmers")
    .insert({
      mobile_number: mobile,
      name: name || "Farmer",
      village: village || null,
      district: district || null,
      state: state || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function findOrCreateCropIdByName(name) {
  if (!name) throw new Error("Crop name is required.");
  const supabase = await getSupabaseClient();
  const { data: existing, error: findErr } = await supabase
    .from("crops")
    .select("id")
    .eq("name", name)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("crops")
    .insert({ name, season: "kharif" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function findOrCreateCenterIdByName(name) {
  if (!name) throw new Error("Procurement center is required.");
  const supabase = await getSupabaseClient();
  const { data: existing, error: findErr } = await supabase
    .from("procurement_centers")
    .select("id")
    .eq("name", name)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("procurement_centers")
    .insert({ name })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function findOrCreateSlot(centerId, dateStr, slotKey) {
  const slotTime = SLOT_TIMES[slotKey] || SLOT_TIMES.morning;
  const supabase = await getSupabaseClient();
  const { data: existing, error: findErr } = await supabase
    .from("procurement_slots")
    .select("id")
    .eq("center_id", centerId)
    .eq("slot_date", dateStr)
    .eq("slot_time", slotTime)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("procurement_slots")
    .insert({ center_id: centerId, slot_date: dateStr, slot_time: slotTime, capacity: 20 })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function createBooking({ farmerId, cropId, centerId, slotId, quantity }) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      farmer_id: farmerId,
      crop_id: cropId,
      center_id: centerId,
      slot_id: slotId,
      quantity_quintal: quantity,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function createTokenForBooking({ bookingId, centerId }) {
  const supabase = await getSupabaseClient();
  const { count } = await supabase
    .from("tokens")
    .select("*", { count: "exact", head: true })
    .eq("center_id", centerId);
  const tokenNumber = (count || 0) + 1;

  const { data, error } = await supabase
    .from("tokens")
    .insert({ booking_id: bookingId, center_id: centerId, token_number: tokenNumber })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Full flow used by the "Confirm Reservation" button: resolves/creates
// the crop, center, and slot rows, then writes the real booking + token.
async function bookProcurementSlot({
  mobile,
  farmerName,
  cropName,
  centerName,
  dateStr,
  slotKey,
  quantity,
}) {
  const farmer = await upsertFarmer({ mobile, name: farmerName });
  const [cropId, centerId] = await Promise.all([
    findOrCreateCropIdByName(cropName),
    findOrCreateCenterIdByName(centerName),
  ]);
  const slotId = await findOrCreateSlot(centerId, dateStr, slotKey);
  const booking = await createBooking({
    farmerId: farmer.id,
    cropId,
    centerId,
    slotId,
    quantity,
  });
  const token = await createTokenForBooking({ bookingId: booking.id, centerId });
  return { farmer, booking, token };
}

// Live snapshot of one booking — crop/center/quantity/MSP/payment/status —
// read straight from vw_transaction_history so the Token, Payment and
// Transaction History screens always show what's actually in Supabase
// (what the center admin has recorded) instead of fixed demo numbers.
async function getBookingSnapshot(bookingUuid) {
  if (!bookingUuid) return null;
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("vw_transaction_history")
    .select("*")
    .eq("booking_id", bookingUuid)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

// Real queue numbers for the Live Token & Queue screen, computed from
// the actual bookings at this center — no fixed "7th in line" demo data.
//   waitingFarmers - everyone still booked/checked-in at this center
//   farmersAhead   - of those, how many were booked before this one
//   currentlyServing - the token currently checked-in at the counter
//   avgProcessingMinutes - real average of past confirmed check-in -> confirm
//                          times at this center (null if no history yet)
async function getQueueSnapshot({ centerId, bookingUuid, createdAt }) {
  if (!centerId || !bookingUuid) return null;
  const supabase = await getSupabaseClient();

  const { count: waitingFarmers } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("center_id", centerId)
    .in("status", ["booked", "checked_in"]);

  const { count: farmersAheadRaw } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("center_id", centerId)
    .in("status", ["booked", "checked_in"])
    .lt("created_at", createdAt)
    .neq("id", bookingUuid);

  const { data: servingRows } = await supabase
    .from("bookings")
    .select("id, checked_in_at, tokens(token_number)")
    .eq("center_id", centerId)
    .eq("status", "checked_in")
    .order("checked_in_at", { ascending: false })
    .limit(1);

  let currentlyServingToken = null;
  if (servingRows && servingRows[0] && servingRows[0].tokens) {
    const t = Array.isArray(servingRows[0].tokens) ? servingRows[0].tokens[0] : servingRows[0].tokens;
    currentlyServingToken = t ? t.token_number : null;
  }

  const { data: processedRows } = await supabase
    .from("bookings")
    .select("checked_in_at, confirmed_at")
    .eq("center_id", centerId)
    .eq("status", "confirmed")
    .not("checked_in_at", "is", null)
    .not("confirmed_at", "is", null)
    .order("confirmed_at", { ascending: false })
    .limit(20);

  let avgProcessingMinutes = null;
  if (processedRows && processedRows.length > 0) {
    const totalMinutes = processedRows.reduce((sum, r) => {
      const start = new Date(r.checked_in_at).getTime();
      const end = new Date(r.confirmed_at).getTime();
      return sum + Math.max(0, (end - start) / 60000);
    }, 0);
    avgProcessingMinutes = Math.round(totalMinutes / processedRows.length);
  }

  return {
    waitingFarmers: waitingFarmers || 0,
    farmersAhead: Math.max(0, farmersAheadRaw || 0),
    currentlyServingToken,
    avgProcessingMinutes,
  };
}

window.AnnasetuSync = {
  findFarmerByMobile,
  upsertFarmer,
  bookProcurementSlot,
  getBookingSnapshot,
  getQueueSnapshot,
};
