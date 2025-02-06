"use server";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getSession, logout } from "@/utils/sessions";

export async function DELETE() {
  const session = await getSession();
  console.log("🔍 Session récupérée :", session);

    if (!session) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

  const userId = session.rowid; // Vérifie si l'ID est bien récupéré

  // Supprimer l'utilisateur
  const deleted = await deleteUser(userId);
  if (!deleted) {
    return NextResponse.json({ message: "Erreur lors de la suppression" }, { status: 500 });
  }

  // Déconnecter l'utilisateur après suppression
  await logout();

  return NextResponse.json({ message: "Utilisateur supprimé avec succès" }, { status: 200 });
}

// 🗑️ Supprimer l'utilisateur
async function deleteUser(id: number) {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur:", error.message);
    return false;
  }

  return true;
}