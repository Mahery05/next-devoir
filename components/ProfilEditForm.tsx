import { useEffect, useState } from "react";
import { getSession } from "@/utils/sessions"; // Assure-toi que la fonction getSession existe et récupère bien les données de session

const ProfilEditForm = () => {

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // État pour gérer le chargement des données
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await getSession(); // Récupérer la session
        if (session && session.id) {
          // Récupérer les données de l'utilisateur avec l'ID depuis ton API ou ta base de données
          const response = await fetch(`/api/user/${session.id}`);
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données utilisateur.");
          }
          const data = await response.json();
          setUserData(data); // Mettre à jour l'état avec les données utilisateur
        } else {
          setError("Utilisateur non authentifié.");
        }
      } catch (error) {
        console.error(error);
        setError("Une erreur est survenue lors de la récupération des données.");
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchUserData();
  }, []); // Ce useEffect ne dépend de rien, donc il s'exécute une seule fois lors du montage

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour envoyer les données modifiées (à compléter)
  };

  return (
    <>
      <h2>Éditer mon profil</h2>
      {loading ? (
        <p>Chargement des données...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Prénom :</label>
          <input type="text" value={userData?.prenom || ""} readOnly={false} />
          <label>Nom :</label>
          <input type="text" value={userData?.nom || ""} readOnly={false} />
          <label>Email :</label>
          <input type="email" value={userData?.email || ""} readOnly={false} />
          {/* Ajouter un bouton pour enregistrer les modifications */}
          <button type="submit">Enregistrer</button>
        </form>
      )}
    </>
  );
};

export default ProfilEditForm;


