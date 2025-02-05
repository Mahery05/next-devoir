"use client";

import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabaseClient';

interface DetailsActiviteProps {
  id: number;
}

const DetailsActivite: React.FC<DetailsActiviteProps> = ({ id }) => {
  const [activite, setActivite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivite = async () => {
      try {
        const { data, error } = await supabase
          .from("activites")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw new Error(`Erreur lors de la récupération des données: ${error.message}`);
        }

        if (data) {
          setActivite(data);
        } else {
          throw new Error('Aucune activité trouvée avec cet ID');
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Erreur lors de la récupération de l\'activité:', error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchActivite();
  }, [id]);

  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1>Détails de l&apos;activité</h1>
      {activite && (
        <div>
          <p>Nom: {activite.nom}</p>
          <p>Description: {activite.description}</p>
          <p>Date de début: {new Date(activite.datetime_debut).toLocaleString()}</p>
          <p>Durée: {activite.duree} minutes</p>
          <p>Places disponibles: {activite.places_disponibles}</p>
          <p>Type d&apos;activité: {activite.type_id}</p>
        </div>
      )}
    </div>
  );
};

export default DetailsActivite;