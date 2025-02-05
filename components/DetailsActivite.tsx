"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activite } from '@/types/Activite';

const DetailsActivite = () => {
  const { id } = useParams();
  const [activite, setActivite] = useState<Activite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ID récupéré:", id);

   
    if (id) {
      const fetchActivite = async () => {
        try {
          
          const response = await fetch(`/api/activite/${id}`);

          
          if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données (Statut: ${response.status})`);
          }

          
          const data = await response.json();
          console.log("Données de l'activité:", data);

          
          if (data && data.nom) {
            setActivite(data);
          } else {
            throw new Error('Aucune activité trouvée avec cet ID');
          }

          setLoading(false);
        } catch (error) {
            const errorMessage = error as { message: string };
          console.error('Erreur lors de la récupération de l\'activité:', errorMessage);
          setError(errorMessage.message);
          setLoading(false);
        }
      };

      fetchActivite();
    } else {
      setError('ID manquant');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  
  if (error) {
    return <p>{error}</p>;
  }

 
  if (!activite) {
    return <p>Aucune activité trouvée</p>;
  }

  
  return (
    <div>
      <h1>Détails de l&apos;activité</h1>
      <p><strong>Nom:</strong> {activite.nom || 'Nom indisponible'}</p>
      <p><strong>Description:</strong> {activite.description || 'Description indisponible'}</p>
      <p><strong>Date:</strong> {activite.datetime_debut ? new Date(activite.datetime_debut).toLocaleString() : 'Date indisponible'}</p>
      <p><strong>Durée:</strong> {activite.duree || 'Durée indisponible'} minutes</p>
      <p><strong>Places disponibles:</strong> {activite.places_disponibles || 'Indisponible'}</p>
    </div>
  );
};

export default DetailsActivite;
