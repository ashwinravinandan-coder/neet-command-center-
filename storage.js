import { supabase } from "./supabaseClient";

/* ============================================================
   Storage adapter — same loadBlob/saveBlob shape the app already
   uses everywhere, now backed by a real Supabase table instead
   of Claude's window.storage. Every row is scoped to the signed
   in user's ID via Row Level Security, so two people can use the
   same deployed app and never see each other's data.
   ============================================================ */

let currentUserId = null;
export function setCurrentUserId(id) {
  currentUserId = id;
}
export function getCurrentUserId() {
  return currentUserId;
}

export async function loadBlob(key, fallback) {
  if (!currentUserId) return fallback;
  try {
    const { data, error } = await supabase
      .from("app_data")
      .select("value")
      .eq("user_id", currentUserId)
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return fallback;
    return data.value ?? fallback;
  } catch (e) {
    console.error("loadBlob failed", key, e);
    return fallback;
  }
}

export async function saveBlob(key, value) {
  if (!currentUserId) return;
  try {
    const { error } = await supabase
      .from("app_data")
      .upsert(
        { user_id: currentUserId, key, value, updated_at: new Date().toISOString() },
        { onConflict: "user_id,key" }
      );
    if (error) console.error("saveBlob failed", key, error);
  } catch (e) {
    console.error("saveBlob failed", key, e);
  }
}
