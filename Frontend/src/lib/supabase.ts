/// <reference types="vite/client" />

import { createClient } from "@supabase/supabase-js";

// Mengambil variabel dari .env menggunakan standar Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi agar aplikasi memberikan error yang jelas jika .env lupa diisi
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Periksa file .env Anda.",
  );
}

// Inisialisasi dan ekspor klien Supabase agar bisa dipanggil di file (komponen) lain
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
