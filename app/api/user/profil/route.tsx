import { supabase } from "@/lib/supabaseClient";
import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  const { data, error } = await supabase.from("users").select("*").eq("id", session.rowid).single();
  if (error) return NextResponse.json({ message: `Erreur: ${error.message}` }, { status: 500 });

  return NextResponse.json(data);
}