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
  const { nom, datetime_debut, duree, description, places_disponibles, type_id } = body;

  // Appeler la fonction createTypeActivite pour ajouter le type d'activité
  const response = await createActivites(nom, datetime_debut, duree, description, places_disponibles, type_id);

  // Si la création a échoué, renvoyer un message d'erreur
  if (response == false) {
    return NextResponse.json(
      { message: "Failed to create activite" },
      { status: 400 }
    );
  }

  // Sinon, renvoyer la réponse avec l'objet créé
  return NextResponse.json({ message: "Activite created", data: response });
}

async function createActivites(nom: string, datetime_debut: string, duree: string, description: string, places_disponibles: number, type_id: number) {
  // Vérifier si un type d'activité avec ce nom existe déjà
  const { data: existingType } = await supabase
    .from("activites")
    .select("*")
    .eq("datetime_debut", datetime_debut)
    .eq("nom", nom)
    .eq("duree", duree)
    .eq("description", description)
    .eq("places_disponibles", places_disponibles)
    .eq("type_id", type_id)
    .single();

  if (existingType) {
    return false; // Si le nom existe déjà
  }

  // Insérer un nouveau type d'activité dans la table type_activite
  const { data, error } = await supabase
    .from("activites")
    .insert([{ nom, datetime_debut, duree, description, places_disponibles, type_id }])
    .select("*") // Sélectionner toutes les colonnes de la nouvelle entrée
    .single();

  if (error) {
    console.error("Error creating activite:", error.message);
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

    // Récupérer les réservations des depuis Supabase
    const { data, error } = await supabase
      .from("activites")
      .select("*")
      
  
    if (error || !data) {
      console.log("Aucune activites");
      return NextResponse.json([]);
    }
  
    const plainData = JSON.parse(JSON.stringify(data));
  
  
    console.log("reservations", data);
  
    return NextResponse.json(plainData);
}