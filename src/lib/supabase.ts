import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase-database";
const supabaseUrl = "https://owulbkzdvfnyuduqsmbd.supabase.co";
// const supabaseKey = ;
export const supabase = createClient<Database>(
  "https://owulbkzdvfnyuduqsmbd.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);
