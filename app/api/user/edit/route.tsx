import { supabase } from "@/lib/supabaseClient";
import { createCookie, getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getSession();

  const body = await req.json();
  const { prenom, nom, email } = body;

  const { data, error } = await supabase.from("users").update({ prenom, nom, email }).eq("id", session.rowid).select("*").single();
  if (error) return NextResponse.json({ message: `Erreur: ${error.message}` }, { status: 500 });

  const sessionData = { rowid: data.id, email: data.email, prenom: data.prenom, nom: data.nom }; // Inclure prénom et nom dans le JWT payload
  await createCookie(sessionData);

  return NextResponse.json({ message: "Profil mis à jour", data });
}