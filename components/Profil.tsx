"use client";

import { getSession } from "@/utils/sessions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Profil = () => {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      console.log("🔍 Session récupérée:", sessionData);
      setSession(sessionData);
    };

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
          <Link href="mon-profil/edit">Modifier mon profil</Link>
        </div>
      ) : (
        <p>Chargement des données utilisateur...</p>
      )}
    </>
  );
};

export default Profil;
