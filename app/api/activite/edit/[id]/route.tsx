"use server";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Initialisation du client Supabase avec les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}


// Fonction de mise à jour (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id; // Récupération de l'ID depuis les params de la route

  if (!id) {
    return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { nom, datetime_debut, duree, description, places_disponibles, type_id } = body;

    // Vérifier que toutes les données sont présentes
    if (!nom || !datetime_debut || !duree || !description || !places_disponibles || !type_id) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 });
    }

    // Mise à jour de l'activité
    const { data, error } = await supabase
      .from("activites")
      .update({ nom, datetime_debut, duree, description, places_disponibles, type_id })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ message: `Erreur lors de la mise à jour: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: "Activité mise à jour avec succès", data });
  } catch (error) {
    const errorMessage = error as {message: string};
    if(errorMessage.message){
        return NextResponse.json({ message: errorMessage.message }, { status: 400 });
    }
    
    return NextResponse.json({ message: `Erreur interne du serveur: ${error}` }, { status: 500 });
}
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id; // Récupération de l'ID depuis les params de la route
    try {
        // Vérifier si l'activité existe
        const { data: existingActivite, error: fetchError } = await supabase
        .from("activites")
        .select("*")
        .eq("id", id)
        .single();

        if (fetchError || !existingActivite) {
        return NextResponse.json({ message: "Activité introuvable" }, { status: 404 });
        }

        return NextResponse.json(existingActivite);
    } catch (error) {
        const errorMessage = error as {message: string};
        if(errorMessage.message){
            return NextResponse.json({ message: errorMessage.message }, { status: 400 });
        }
        
        return NextResponse.json({ message: `Erreur interne du serveur: ${error}` }, { status: 500 });

    }
}