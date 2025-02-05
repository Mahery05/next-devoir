"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/utils/sessions"; // Assure-toi que c'est bien le bon chemin

export default function MonComptePage() {
  const [session, setSession] = useState<any>(null); // Utiliser any si tu n'as pas de typage exact

  const fetchSession = async () => {
    const sessionData = await getSession();
    console.log("Session data:", sessionData); // Vérifie la structure ici
    setSession(sessionData);
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <>
      <h2>Mon profil</h2>
      {session ? (
        <div>
          <p><strong>Prénom :</strong> {session.prenom || 'Non disponible'}</p>
          <p><strong>Nom :</strong> {session.nom || 'Non disponible'}</p>
          <p><strong>Email :</strong> {session.email || 'Non disponible'}</p>
        </div>
      ) : (
        <p>Chargement des données utilisateur...</p>
      )}
    </>
  );
}
