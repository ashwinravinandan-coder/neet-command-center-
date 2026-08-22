import { createClient } from "@supabase/supabase-js";

// These come from your Supabase project settings — you'll paste your own
// values into a file called `.env` before deploying (instructions provided
// separately). Never commit real keys to a public repo.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
