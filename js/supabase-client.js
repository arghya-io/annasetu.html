// /js/supabase-client.js
//
// Fetches public config from /api/config, then creates a single
// shared Supabase client for the browser to use.
//
// Usage (in a <script type="module">):
//   import { getSupabaseClient } from "/js/supabase-client.js";
//   const supabase = await getSupabaseClient();

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

let clientPromise = null;

async function loadConfig() {
  const response = await fetch("/api/config");
  if (!response.ok) {
    throw new Error(
      "Could not load Supabase config from /api/config. Check that SUPABASE_URL and SUPABASE_ANON_KEY are set in Vercel."
    );
  }
  return response.json();
}

export function getSupabaseClient() {
  if (!clientPromise) {
    clientPromise = loadConfig().then(({ supabaseUrl, supabaseAnonKey }) =>
      createClient(supabaseUrl, supabaseAnonKey)
    );
  }
  return clientPromise;
}
