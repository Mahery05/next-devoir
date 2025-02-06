import { getSession } from "@/utils/sessions";
import router from "next/router";
import { useState, useEffect } from "react";


const Profil = () => { 
    const [session, setSession] = useState<any>(null); // Utiliser any si tu n'as pas de typage exact

    const fetchSession = async () => {
      const sessionData = await getSession();
      console.log("Session data:", sessionData); // Vérifie la structure ici
      setSession(sessionData);
    };
  
    useEffect(() => {
      fetchSession();
    }, []);

    const handleEdit = () => {
        if (session && session.id) {
          // Rediriger vers la page d'édition du profil avec l'ID de l'utilisateur
          router.push(`/mon-profil/edit/${session.id}`);
        }
      };
  
    return (
      <>
        <h2>Mon profil</h2>
        {session ? (
          <div>
            <p><strong>Prénom :</strong> {session.prenom || 'Non disponible'}</p>
            <p><strong>Nom :</strong> {session.nom || 'Non disponible'}</p>
            <p><strong>Email :</strong> {session.email || 'Non disponible'}</p>
            <button onClick={handleEdit}>Modifier mon profil</button>
          </div>
        ) : (
          <p>Chargement des données utilisateur...</p>
        )}
      </>
    );

};

export default Profil;