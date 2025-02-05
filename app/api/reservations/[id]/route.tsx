"use server";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/utils/sessions";

// Initialisation de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🔹 Récupérer les réservations de l'utilisateur connecté
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("user_id", session.rowid);

  if (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// 🔹 Modifier l'état d'une réservation (ex: annuler ou réactiver)
export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    console.error("🔴 Erreur : Utilisateur non autorisé");
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("🔹 Corps de la requête reçu :", body);

    const { id, newEtat } = body;

    if (!id || newEtat === undefined) {
      console.error("🔴 Erreur : ID ou état manquant");
      return NextResponse.json({ message: "ID ou état manquant" }, { status: 400 });
    }

    console.log(`🛠 Mise à jour de la réservation ${id} avec etat = ${newEtat}`);

    // Vérification que l'ID est bien un nombre
    if (typeof id !== "number") {
      console.error("🔴 Erreur : ID invalide (pas un nombre)", id);
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });
    }

    // Vérification que l'état est bien un booléen (true / false)
    if (typeof newEtat !== "boolean") {
      console.error("🔴 Erreur : Etat invalide (doit être un booléen)", newEtat);
      return NextResponse.json({ message: "Etat invalide" }, { status: 400 });
    }

    // Mise à jour de la réservation
    const { data, error } = await supabase
      .from("reservations")
      .update({ etat: newEtat })
      .eq("id", id)
      .eq("user_id", session.rowid)
      .select()
      .single();

    console.log("🔹 Réponse Supabase :", { data, error });

    if (error) {
      console.error("🔴 Erreur Supabase :", error);
      return NextResponse.json({ message: "Erreur Supabase", details: error }, { status: 500 });
    }

    console.log("✅ Mise à jour réussie :", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("🔴 Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur interne", details: error }, { status: 500 });
  }
}