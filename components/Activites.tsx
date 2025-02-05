"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Activite } from '@/types/Activite';
import { TypeActivite } from '@/types/TypeActivite';



const Activites = () => {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [typeActivites, setTypeActivites] = useState<TypeActivite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: activitesData, error: activitesError } = await supabase
        .from('activites')
        .select('*');

      const { data: typeActivitesData, error: typeActivitesError } = await supabase
        .from('type_activite')
        .select('*');

      if (activitesError || typeActivitesError) {
        console.error('Erreur lors du chargement des données');
        setLoading(false);
        return;
      }

      setActivites(activitesData);
      setTypeActivites(typeActivitesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  const getTypeNom = (typeId: number) => {
    const type = typeActivites.find((type) => type.id === typeId);
    return type ? type.nom : 'Type inconnu';
  };

  return (
    <>
      {activites.length > 0 ? (
        <>
          {activites.map((activite: Activite, i: number) => {
            return (
              <p key={i}>
                {activite.nom} : {new Date(activite.datetime_debut).toLocaleString()} : {activite.description} : {activite.duree} minutes : {activite.places_disponibles} places disponibles : {getTypeNom(activite.type_id)}
              </p>
            );
          })}
        </>
      ) : (
        <p>Aucune activité</p>
      )}
    </>
  );
};

export default Activites;