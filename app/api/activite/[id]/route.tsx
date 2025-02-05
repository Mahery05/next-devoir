"use server";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

// Initialisation du client Supabase avec les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string || ""
  );

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); 

  if (!id) {
    return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("activites")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Activité non trouvée" }, { status: 404 });
  }

  return NextResponse.json(data);
}


export async function DELETE(req: Request) {
  // Récupérer l'ID de l'élément à supprimer depuis l'URL de la requête
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Supposer que l'ID est passé dans l'URL
  
  if (!id) {
    return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  }

  // Appeler la fonction deleteActivite pour supprimer l'activité
  const response = await deleteActivite(Number(id));

  // Si la suppression a échoué, renvoyer un message d'erreur
  if (response == false) {
    return NextResponse.json(
      { message: "Failed to delete activite" },
      { status: 400 }
    );
  }

  // Sinon, renvoyer un message de succès
  return NextResponse.json({ message: "Activite deleted" });
}

async function deleteActivite(id: number) {
  // Vérifier si l'activité existe avant de la supprimer
  const { data: existingActivite, error: fetchError } = await supabase
    .from("activites")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existingActivite) {
    console.error("Error fetching activite:", fetchError?.message);
    return false; // Retourner false si l'activité n'existe pas
  }

  // Supprimer l'activité de la table activites
  const { error } = await supabase
    .from("activites")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting activite:", error.message);
    return false; // Retourner false en cas d'erreur
  }

  return true; // Retourner true si la suppression a réussi
}
