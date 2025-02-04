"use server";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/utils/sessions";



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
  const { datereservation, etat, activite_id, user_id } = body;

  // Appeler la fonction createTypeActivite pour ajouter le type d'activité
  const response = await createReservation( datereservation, etat , activite_id, user_id);

  // Si la création a échoué, renvoyer un message d'erreur
  if (response == false) {
    return NextResponse.json(
      { message: "Failed to create activite" },
      { status: 400 }
    );
  }

  // Sinon, renvoyer la réponse avec l'objet créé
  return NextResponse.json({ message: "Reservation created", data: response });
}

async function createReservation(datereservation: string, etat: string, activite_id: number, user_id: number) {
  // Vérifier si un type d'activité avec ce nom existe déjà
  const { data: existingType } = await supabase
    .from("activites")
    .select("*")
    .eq("datereservation", datereservation)
    .eq("etat", etat)
    .eq("duree", activite_id)
    .eq("description", user_id)
    .single();

  if (existingType) {
    return false; // Si le nom existe déjà
  }

  // Insérer un nouveau type d'activité dans la table type_activite
  const { data, error } = await supabase
    .from("reservations")
    .insert([{ datereservation, etat, activite_id, user_id }])
    .select("*") // Sélectionner toutes les colonnes de la nouvelle entrée
    .single();

  if (error) {
    console.error("Error creating reservation:", error.message);
    return false; // Retourner false en cas d'erreur
  }

  return data; // Retourner l'entrée créée
}


export async function GET() {
  const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string || ""
    );
  
    // Obtenir l'utilisateur connecté
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les réservations de l'utilisateur depuis Supabase
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", session.rowid);
  
    if (error || !data) {
      console.log("Aucune réservation");
      return NextResponse.json([]);
    }
  
    const plainData = JSON.parse(JSON.stringify(data));
  
  
    console.log("reservations", data);
  
    return NextResponse.json(plainData);
}