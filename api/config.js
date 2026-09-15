// /api/config — Vercel serverless function (Node runtime)
//
// Serves ONLY the public Supabase URL + anon key to the browser.
// Set these in Vercel Project Settings → Environment Variables:
//   SUPABASE_URL       e.g. https://xxxxx.supabase.co
//   SUPABASE_ANON_KEY  the "anon public" key from Supabase API settings
//
// Never put the service_role key here — it must never reach the browser.

module.exports = async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({
      error:
        "Supabase env vars are missing. Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel project settings.",
    });
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ supabaseUrl, supabaseAnonKey });
};
