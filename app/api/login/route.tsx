"use server";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkPassword } from "@/utils/bcryptjs";

import { createCookie } from "@/utils/sessions";

// Initialisation du client Supabase avec les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  // Récupérer le corps de la requête
  const body = await req.json();
  const { email, motdepasse } = body;

  // Appeler la fonction login pour vérifier l'utilisateur
  const response = await login(email, motdepasse);

  // Si la réponse est fausse (identifiants invalides)
  if (response == false) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 403 }
    );
  }

  // Inclure prénom et nom dans les données de session à stocker
  const { id, email: userEmail, prenom, nom } = response;

  const sessionData = { rowid: id, email: userEmail, prenom, nom }; // Inclure prénom et nom dans le JWT payload
  await createCookie(sessionData);

  return NextResponse.json({ response });
}

async function login(email: string, motdepasse: string) {
  // Récupérer l'utilisateur avec email, mot de passe, prénom, et nom
  const { data: user, error } = await supabase
    .from("users")
    .select("email, motdepasse, id, prenom, nom") // Sélectionner les champs nécessaires
    .eq("email", email)
    .single();

  if (error || !user) {
    return false; // Utilisateur non trouvé
  }

  // Vérifier si le mot de passe est correct
  const isPasswordCorrect = await checkPassword(motdepasse, user.motdepasse);

  if (!isPasswordCorrect) {
    return false; // Mot de passe incorrect
  }

  // Retourner toutes les informations nécessaires pour la session
  return {
    id: user.id,
    email: user.email,
    prenom: user.prenom,
    nom: user.nom
  };
}

