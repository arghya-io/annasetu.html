# Crop Procurement Portal — Deploy Guide

## What changed in this pass
- Merged in your latest upload (multilingual UI, ticker pause fix, and a real
  `/api/msp` endpoint that pulls live MSP data from CACP with an official
  fallback) as the new base for the farmer-facing app.
- Removed dead/orphaned files again: `.js/auth.js`, `.js/crop-msp.js`
  (still not linked from `index.html` in your new upload either — same
  duplicated logic, now superseded by `/api/msp` + the inline fallback array).
- Admin login (mock, unchanged) redirects into the **admin portal**
  (`admin.html`) instead of a dead-end alert.
- Full admin portal with CRUD for all 6 features: Farmers, Crops & MSP,
  Procurement Centers, Slots, Bookings, Produce Registrations, Tokens/Queue,
  Payments, and Admins — carried over unchanged from the previous pass.
- Supabase schema + RLS + seed data under `main/Supabase/Migrations/`,
  updated so the seeded crop list (Rice, Jute, Maize, Wheat, Mustard,
  Groundnut, Sunflower, Gram) and MSP prices match what `/api/msp` and
  `script.js` actually use now (Jute is `season = 'commercial'`, matching
  the app; the schema's season check now allows that value).
- `/api/config.js` rewritten in the same CommonJS style as your `/api/msp.js`
  for consistency (both are plain Vercel Node functions, no build step).

## 1. Set up Supabase
1. Create a project at supabase.com.
2. In the SQL editor, run the files in `main/Supabase/Migrations/` **in
   order**:
   - `0001_init_schema.sql`
   - `0002_rls_policies.sql`
   - `0003_seed_data.sql`
   - `0004_grants_and_checkin.sql` — fixes the "permission denied for
     table ..." error some Supabase projects hit even with the 0002
     policies in place (plain table GRANTs, not just RLS, need to be
     given to `anon`/`authenticated`), and adds the farmer check-in /
     weigh-in workflow to `bookings` (see below). Already ran 0001–0003
     on an existing project? It's safe to run 0004 on top — it only
     adds/alters, it doesn't redo the earlier files.
3. Copy your **Project URL** and **anon public key** from
   Project Settings → API.

### Booking lifecycle (after 0004)
A booking now has an explicit lifecycle instead of jumping straight to
"confirmed":
- **booked** — the farmer reserved a slot with an *approximate*
  quantity (`quantity_quintal`). This is the default status.
- **checked_in** — the farmer has physically arrived at the center.
- **confirmed** — the center admin has weighed the produce and entered
  the real figures (`actual_quantity_quintal`, `quality_grade`,
  `moisture_percent`) via the **Check-in & Weigh** button on the
  Bookings screen, then confirmed it.
- **cancelled** / **no_show** — the booking didn't result in a
  procurement.

The admin portal's Bookings table shows both the farmer's declared
quantity and the admin's weighed quantity side by side, so nothing is
ever silently overwritten.

## 2. Deploy to Vercel
1. Push this folder to a Git repo, import it in Vercel.
2. In Vercel → Project → Settings → Environment Variables, add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_ANON_KEY` = your Supabase anon public key
3. Deploy. The static site + `/api/config` function need no build step.

## 3. Using the admin portal
- The admin portal is the **procurement center's own check-in desk** —
  the staff who receive farmers and produce at that specific center. It
  is not a government office or a multi-center authority view.
- Go to `/` → click **Admin/Operator** → enter any ID + password (mock login,
  unchanged from the original build) → you land on `/admin.html`.
- Every farmer booking (made from the live farmer app) now shows up here
  in real time — the farmer-facing "Confirm Reservation" button writes a
  real row to `bookings` (via `js/booking-sync.js`) instead of only
  saving to the farmer's own browser.
- The portal is deliberately reduced to two screens:
  - **Active Bookings** — every farmer currently waiting, sorted by
    token number (queue order), each with:
    - **Inspect** — opens a form with the farmer's details and their
      declared quantity shown read-only (untouchable), and lets the
      admin enter the final weighed quantity, grade, and moisture.
      "Save Inspection Data" marks the booking `confirmed`, marks the
      token `completed`, and moves the record to Procurement History.
    - **Reject** — marks the booking `cancelled` or `no_show` (with an
      optional note) and moves it to Procurement History instead.
  - **Procurement History** — every inspected booking, filterable by
    Everything / Succeeded / Rejected.
- There are no separate Farmers / Crops / Centers / Slots / Tokens /
  Payments management screens anymore — that data still lives in and
  drives these two views, it's just not independently editable from
  the admin portal.

## ⚠️ Known limitation — read before opening this to real users
The login screens are still the **mock** demo flow (no real Supabase Auth
session is created). To make the admin portal usable at all in that state,
`0002_rls_policies.sql` grants the `anon` key full read/write on every table —
that's fine for an internal/staging build, but it means anyone with the anon
key can write data. Before this goes in front of real farmers or admins:
1. Add real auth (Supabase Auth phone OTP for farmers, email/password or
   magic link for admins).
2. Replace the policies marked `TODO(auth)` in `0002_rls_policies.sql` with
   ones scoped to `auth.uid()`.

## File map
```
index.html, style.css, script.js   → existing farmer-facing app (cleaned up)
admin.html, admin.css, admin.js    → new admin portal (Supabase-backed CRUD)
js/supabase-client.js              → shared Supabase client loader
js/booking-sync.js                 → real Supabase writes for the farmer booking flow
api/config.js                      → Vercel function exposing public config
main/Supabase/Migrations/*.sql     → run these in Supabase, in order
```
