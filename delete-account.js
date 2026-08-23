// Runs server-side only. Requires SUPABASE_SERVICE_ROLE_KEY as a Vercel
// environment variable (NOT prefixed with VITE_, so it is never bundled
// into client-side code). Get this key from Supabase → Project Settings
// → API → "service_role" (secret) — never share it, never put it in the
// frontend.
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.replace("Bearer ", "");
  if (!accessToken) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Server not configured (missing service role key)" });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Verify the token belongs to a real, current user before deleting anything.
    const { data: userData, error: userErr } = await adminClient.auth.getUser(accessToken);
    if (userErr || !userData?.user) {
      return res.status(401).json({ error: "Invalid session" });
    }
    const userId = userData.user.id;

    // Remove personal data rows first (app_data), then the auth account itself.
    const { error: dataDelErr } = await adminClient.from("app_data").delete().eq("user_id", userId);
    if (dataDelErr) {
      return res.status(500).json({ error: `Failed to delete data: ${dataDelErr.message}` });
    }

    const { error: authDelErr } = await adminClient.auth.admin.deleteUser(userId);
    if (authDelErr) {
      return res.status(500).json({ error: `Failed to delete account: ${authDelErr.message}` });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unexpected error" });
  }
}
