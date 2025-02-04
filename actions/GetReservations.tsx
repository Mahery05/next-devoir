"use server";

import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function getReservations() {
    // Initialiser le client Supabase
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
    .eq("user_id", session.id);

  if (error || !data) {
    console.log("Aucune réservation");

    return NextResponse.json("");
    
    return NextResponse.json({ message : "Aucune réservation" }, { status: 400 });
  }

  const plainData = JSON.parse(JSON.stringify(data));


  console.log("reservations", data);

  return NextResponse.json(plainData);
}