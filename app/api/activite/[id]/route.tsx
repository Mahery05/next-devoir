"use server";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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