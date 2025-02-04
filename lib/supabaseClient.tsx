import { createClient } from '@supabase/supabase-js';

// Vos variables d'environnement Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialisation du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);