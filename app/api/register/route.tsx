"use server";

import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase avec les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  // Récupérer le corps de la requête
  const body = await req.json();
  const { nom, prenom, email, motdepasse, role } = body;

  // Appeler la fonction register pour créer l'utilisateur
  const response = await register(nom, prenom, email, motdepasse, role);

  // Si la réponse est fausse (utilisateur existe déjà)
  if (response == false) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 403 }
    );
  }

  return NextResponse.json({ response });
}

async function register(
  nom: string,
  prenom: string,
  email: string,
  motdepasse: string,
  role: string
  
) {
  // Vérifier si l'utilisateur existe déjà
  const { data: existingUser } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single();

  if (existingUser) {
    return false; // L'utilisateur existe déjà
  }

  // Insérer le nouvel utilisateur dans la table 'users'
  const { data, error } = await supabase
    .from('users')
    .insert([{nom, prenom, email, motdepasse, role }]);

  if (error) {
    console.error('Error inserting user:', error.message);
    return false;
  }

  return data;
}