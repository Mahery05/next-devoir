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
      .from("users")
      .select("*")
      
  
    if (error || !data) {
      console.log("Aucune réservation");
      return NextResponse.json([]);
    }
  
    const plainData = JSON.parse(JSON.stringify(data));
  
  
    console.log("reservations", data);
  
    return NextResponse.json(plainData);
}