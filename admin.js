// /admin.js
//
// Admin portal — reduced, on purpose, to exactly the two things a
// procurement-center admin actually does at the check-in counter:
//
//   1. Active Bookings — every farmer currently waiting, in token
//      (queue) order, with an "Inspect" action to weigh their produce
//      and a "Reject" action for cancellations/no-shows.
//   2. Procurement History — every booking that has already been
//      inspected, successful or rejected, read-only.
//
// No farmers/crops/centers/slots/tokens/payments management screens —
// that data still lives in Supabase and still drives these two views,
// it's just not separately editable from here anymore.

import { getSupabaseClient } from "/js/supabase-client.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const NAV = [
  { key: "active", label: "Active Bookings", icon: "📋" },
  { key: "history", label: "Procurement History", icon: "📜" },
];

const BOOKING_SELECT = `
  id, booking_code, status, quantity_quintal, actual_quantity_quintal,
  quality_grade, moisture_percent, inspection_notes,
  checked_in_at, confirmed_at, created_at,
  farmer_id, crop_id, center_id,
  farmers ( name, mobile_number, village, district, state ),
  crops ( name, icon ),
  procurement_centers ( name ),
  tokens ( id, token_number, status )
`;

let supabase = null;
let currentView = "active";
let historyFilter = "all"; // all | succeeded | rejected

// ---------- Boot ----------

async function boot() {
  const adminSession = sessionStorage.getItem("adminSession");
  if (!adminSession) {
    window.location.href = "index.html";
    return;
  }
  $("#whoami").textContent = `Signed in as ${adminSession}`;

  try {
    supabase = await getSupabaseClient();
  } catch (err) {
    showToast(err.message, true);
    return;
  }

  renderNav();
  await renderView("active");
}

function renderNav() {
  const nav = $("#adminNav");
  nav.innerHTML = "";
  NAV.forEach(({ key, label, icon }) => {
    const btn = document.createElement("button");
    btn.className = "admin-nav-item" + (key === currentView ? " active" : "");
    btn.dataset.view = key;
    btn.innerHTML = `<span>${icon}</span> ${label}`;
    btn.addEventListener("click", () => renderView(key));
    nav.appendChild(btn);
  });
}

async function renderView(key) {
  currentView = key;
  $$(".admin-nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === key));
  if (key === "active") await renderActiveBookings();
  else await renderHistory();
}

// ---------- Shared data loading ----------

// PostgREST returns a 1:1 embed (tokens has a unique booking_id) as
// either an object or a single-item array depending on how the
// relationship was inferred — normalize it either way.
function one(rel) {
  if (!rel) return null;
  return Array.isArray(rel) ? rel[0] || null : rel;
}

async function fetchBookings(statuses) {
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .in("status", statuses)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((b) => ({
    ...b,
    farmer: one(b.farmers),
    crop: one(b.crops),
    center: one(b.procurement_centers),
    token: one(b.tokens),
  }));
}

// ---------- Active Bookings ----------

let activeRows = [];

async function renderActiveBookings() {
  const main = $("#adminContent");
  main.innerHTML = `
    <div class="admin-topbar">
      <div><h1>Active Bookings</h1><p>Farmers waiting to be checked in, in token (queue) order.</p></div>
    </div>
    <div class="admin-panel">
      <div class="admin-panel-head">
        <h2>Queue</h2>
        <input type="text" class="admin-search" id="searchBox" placeholder="Search farmer, mobile, crop...">
      </div>
      <div class="admin-table-wrap" id="tableWrap"></div>
    </div>
  `;
  $("#searchBox").addEventListener("input", (e) => filterAndRenderActive(e.target.value));
  await loadActiveTable();
}

async function loadActiveTable() {
  const wrap = $("#tableWrap");
  wrap.innerHTML = `<div class="admin-empty">Loading…</div>`;
  try {
    activeRows = await fetchBookings(["booked", "checked_in"]);
  } catch (err) {
    wrap.innerHTML = `<div class="admin-empty">Could not load bookings: ${err.message}</div>`;
    return;
  }
  activeRows.sort((a, b) => (a.token?.token_number ?? Infinity) - (b.token?.token_number ?? Infinity));
  filterAndRenderActive($("#searchBox")?.value || "");
}

function filterAndRenderActive(search) {
  const wrap = $("#tableWrap");
  let rows = activeRows;
  if (search) {
    const s = search.toLowerCase();
    rows = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
  }

  if (rows.length === 0) {
    wrap.innerHTML = `<div class="admin-empty">No active bookings right now.</div>`;
    return;
  }

  wrap.innerHTML = `
    <table class="admin-table">
      <thead><tr>
        <th>Token #</th><th>Farmer</th><th>Mobile</th><th>Crop</th>
        <th>Declared Qty</th><th>Center</th><th>Status</th><th>Booked</th><th>Actions</th>
      </tr></thead>
      <tbody>
        ${rows.map(activeRowHtml).join("")}
      </tbody>
    </table>
  `;

  $$(".inspect-row", wrap).forEach((btn) =>
    btn.addEventListener("click", () => openInspectionForm(rows.find((r) => r.id === btn.dataset.id)))
  );
  $$(".reject-row", wrap).forEach((btn) =>
    btn.addEventListener("click", () => openRejectForm(rows.find((r) => r.id === btn.dataset.id)))
  );
}

function activeRowHtml(row) {
  const token = row.token?.token_number ?? "—";
  const farmer = row.farmer?.name ?? "Unknown";
  const mobile = row.farmer?.mobile_number ?? "—";
  const crop = row.crop?.name ?? "—";
  const center = row.center?.name ?? "—";
  return `
    <tr>
      <td><strong>#${token}</strong></td>
      <td>${escapeHtml(farmer)}</td>
      <td>${escapeHtml(mobile)}</td>
      <td>${escapeHtml(crop)}</td>
      <td>${row.quantity_quintal ?? "—"} quintal</td>
      <td>${escapeHtml(center)}</td>
      <td>${statusBadge(row.status)}</td>
      <td>${formatDate(row.created_at)}</td>
      <td class="row-actions">
        <button class="admin-btn admin-btn-primary inspect-row" data-id="${row.id}">Inspect</button>
        <button class="admin-btn admin-btn-danger reject-row" data-id="${row.id}">Reject</button>
      </td>
    </tr>`;
}

// ---------- Inspect (Check-in & Weigh) ----------

async function openInspectionForm(row) {
  if (!row) return;
  const farmer = row.farmer || {};
  const location = [farmer.village, farmer.district, farmer.state].filter(Boolean).join(", ") || "—";

  const overlay = $("#modalOverlay");
  const modal = $("#modalBody");
  modal.innerHTML = `
    <h3>Inspect Booking — ${row.booking_code}</h3>
    <p class="admin-field-hint">Token #${row.token?.token_number ?? "—"} · ${escapeHtml(row.crop?.name ?? "—")} · ${escapeHtml(row.center?.name ?? "—")}</p>

    <div class="admin-field"><label>Farmer Name</label><input type="text" value="${escapeAttr(farmer.name ?? "")}" disabled></div>
    <div class="admin-field"><label>Mobile Number</label><input type="text" value="${escapeAttr(farmer.mobile_number ?? "")}" disabled></div>
    <div class="admin-field"><label>Village / District / State</label><input type="text" value="${escapeAttr(location)}" disabled></div>
    <div class="admin-field"><label>Farmer-Declared Quantity (quintal)</label><input type="text" value="${row.quantity_quintal ?? "—"}" disabled></div>

    <form id="inspectionForm">
      <div class="admin-field">
        <label for="insp_actual_qty">Final Weighed Quantity (quintal) *</label>
        <input type="number" step="0.01" min="0.01" id="insp_actual_qty" value="${row.actual_quantity_quintal ?? ""}" required>
      </div>
      <div class="admin-field">
        <label for="insp_grade">Quality Grade *</label>
        <select id="insp_grade" required>
          ${["", "A", "B", "C"]
            .map((g) => `<option value="${g}" ${row.quality_grade === g ? "selected" : ""}>${g || "— Select —"}</option>`)
            .join("")}
        </select>
      </div>
      <div class="admin-field">
        <label for="insp_moisture">Moisture %</label>
        <input type="number" step="0.01" min="0" id="insp_moisture" value="${row.moisture_percent ?? ""}">
      </div>
      <div class="admin-field">
        <label for="insp_notes">Notes</label>
        <textarea id="insp_notes" rows="2">${row.inspection_notes ?? ""}</textarea>
      </div>
      <div class="admin-modal-actions">
        <button type="button" class="admin-btn admin-btn-ghost" id="cancelInspection">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary">Save Inspection Data</button>
      </div>
    </form>
  `;
  overlay.classList.remove("hidden");

  $("#cancelInspection").addEventListener("click", closeForm);
  $("#inspectionForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const actualQty = Number($("#insp_actual_qty").value);
    const grade = $("#insp_grade").value;
    if (!actualQty || actualQty <= 0) {
      showToast("Enter a valid weighed quantity.", true);
      return;
    }
    if (!grade) {
      showToast("Select a quality grade.", true);
      return;
    }

    const submitBtn = $("#inspectionForm button[type=submit]");
    submitBtn.disabled = true;

    const payload = {
      actual_quantity_quintal: actualQty,
      quality_grade: grade,
      moisture_percent: $("#insp_moisture").value === "" ? null : Number($("#insp_moisture").value),
      inspection_notes: $("#insp_notes").value || null,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      checked_in_at: row.checked_in_at || new Date().toISOString(),
    };

    const { error } = await supabase.from("bookings").update(payload).eq("id", row.id);
    if (error) {
      showToast(error.message, true);
      submitBtn.disabled = false;
      return;
    }

    if (row.token?.id) {
      await supabase
        .from("tokens")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", row.token.id);
    }

    showToast("Inspection saved — moved to Procurement History.");
    closeForm();
    await loadActiveTable();
  });
}

// ---------- Reject ----------

async function openRejectForm(row) {
  if (!row) return;
  const overlay = $("#modalOverlay");
  const modal = $("#modalBody");
  modal.innerHTML = `
    <h3>Reject Booking — ${row.booking_code}</h3>
    <p class="admin-field-hint">${escapeHtml(row.farmer?.name ?? "Unknown farmer")} · Token #${row.token?.token_number ?? "—"}</p>
    <form id="rejectForm">
      <div class="admin-field">
        <label for="rej_reason">Reason</label>
        <select id="rej_reason">
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
      </div>
      <div class="admin-field">
        <label for="rej_notes">Notes (optional)</label>
        <textarea id="rej_notes" rows="2"></textarea>
      </div>
      <div class="admin-modal-actions">
        <button type="button" class="admin-btn admin-btn-ghost" id="cancelReject">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-danger">Confirm Reject</button>
      </div>
    </form>
  `;
  overlay.classList.remove("hidden");

  $("#cancelReject").addEventListener("click", closeForm);
  $("#rejectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $("#rej_reason").value;
    const notes = $("#rej_notes").value || null;

    const { error } = await supabase.from("bookings").update({ status, inspection_notes: notes }).eq("id", row.id);
    if (error) {
      showToast(error.message, true);
      return;
    }
    if (row.token?.id) {
      await supabase.from("tokens").update({ status: "skipped" }).eq("id", row.token.id);
    }
    showToast("Booking rejected.");
    closeForm();
    await loadActiveTable();
  });
}

// ---------- Procurement History ----------

let historyRows = [];

async function renderHistory() {
  const main = $("#adminContent");
  main.innerHTML = `
    <div class="admin-topbar">
      <div><h1>Procurement History</h1><p>Every booking that has already been inspected — succeeded or rejected.</p></div>
    </div>
    <div class="admin-panel">
      <div class="admin-panel-head">
        <h2>Records</h2>
        <div style="display:flex; gap:8px;">
          <select id="historyFilter" class="admin-search">
            <option value="all">Everything</option>
            <option value="succeeded">Succeeded</option>
            <option value="rejected">Rejected</option>
          </select>
          <input type="text" class="admin-search" id="searchBox" placeholder="Search farmer, mobile, crop...">
        </div>
      </div>
      <div class="admin-table-wrap" id="tableWrap"></div>
    </div>
  `;
  $("#historyFilter").value = historyFilter;
  $("#historyFilter").addEventListener("change", (e) => {
    historyFilter = e.target.value;
    filterAndRenderHistory($("#searchBox").value);
  });
  $("#searchBox").addEventListener("input", (e) => filterAndRenderHistory(e.target.value));
  await loadHistoryTable();
}

async function loadHistoryTable() {
  const wrap = $("#tableWrap");
  wrap.innerHTML = `<div class="admin-empty">Loading…</div>`;
  try {
    historyRows = await fetchBookings(["confirmed", "cancelled", "no_show"]);
  } catch (err) {
    wrap.innerHTML = `<div class="admin-empty">Could not load history: ${err.message}</div>`;
    return;
  }
  historyRows.sort((a, b) => new Date(b.confirmed_at || b.created_at) - new Date(a.confirmed_at || a.created_at));
  filterAndRenderHistory($("#searchBox")?.value || "");
}

function filterAndRenderHistory(search) {
  const wrap = $("#tableWrap");
  let rows = historyRows;
  if (historyFilter === "succeeded") rows = rows.filter((r) => r.status === "confirmed");
  if (historyFilter === "rejected") rows = rows.filter((r) => r.status === "cancelled" || r.status === "no_show");
  if (search) {
    const s = search.toLowerCase();
    rows = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
  }

  if (rows.length === 0) {
    wrap.innerHTML = `<div class="admin-empty">No records match.</div>`;
    return;
  }

  wrap.innerHTML = `
    <table class="admin-table">
      <thead><tr>
        <th>Token #</th><th>Farmer</th><th>Mobile</th><th>Crop</th>
        <th>Declared Qty</th><th>Weighed Qty</th><th>Grade</th><th>Moisture %</th>
        <th>Center</th><th>Outcome</th><th>Date</th>
      </tr></thead>
      <tbody>
        ${rows.map(historyRowHtml).join("")}
      </tbody>
    </table>
  `;
}

function historyRowHtml(row) {
  const token = row.token?.token_number ?? "—";
  const farmer = row.farmer?.name ?? "Unknown";
  const mobile = row.farmer?.mobile_number ?? "—";
  const crop = row.crop?.name ?? "—";
  const center = row.center?.name ?? "—";
  const when = row.confirmed_at || row.created_at;
  return `
    <tr>
      <td>#${token}</td>
      <td>${escapeHtml(farmer)}</td>
      <td>${escapeHtml(mobile)}</td>
      <td>${escapeHtml(crop)}</td>
      <td>${row.quantity_quintal ?? "—"}</td>
      <td>${row.actual_quantity_quintal ?? "—"}</td>
      <td>${row.quality_grade ?? "—"}</td>
      <td>${row.moisture_percent ?? "—"}</td>
      <td>${escapeHtml(center)}</td>
      <td>${outcomeBadge(row.status)}</td>
      <td>${formatDate(when)}</td>
    </tr>`;
}

function outcomeBadge(status) {
  if (status === "confirmed") return `<span class="badge badge-confirmed">Succeeded</span>`;
  if (status === "no_show") return `<span class="badge badge-cancelled">No Show</span>`;
  return `<span class="badge badge-cancelled">Cancelled</span>`;
}

// ---------- Shared helpers ----------

function statusBadge(status) {
  const label = String(status).replace(/_/g, " ");
  return `<span class="badge badge-${status}">${label}</span>`;
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(str) {
  return escapeHtml(str);
}

function closeForm() {
  $("#modalOverlay").classList.add("hidden");
}

let toastTimer = null;
function showToast(message, isError = false) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3500);
}

// ---------- Logout ----------

$("#logoutBtn")?.addEventListener("click", () => {
  sessionStorage.removeItem("adminSession");
  window.location.href = "index.html";
});

boot();
