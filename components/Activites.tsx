"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Utilisez 'next/navigation' au lieu de 'next/router'
import { supabase } from '../lib/supabaseClient';
import { Activite } from '@/types/Activite';
import { TypeActivite } from '@/types/TypeActivite';
import Link from 'next/link';
import Image from 'next/image';

const Activites = () => {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [typeActivites, setTypeActivites] = useState<TypeActivite[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleEdit = (id: number) => {
    router.push(`/activites/edit/${id}`);
  };

  return (
    <>
      {activites.length > 0 ? (
        <>
          {activites.map((activite: Activite, i: number) => {
         return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <p>
                <Link href={`/activites/${activite.id}`}>
                  {activite.nom} {/* Lien sur le nom de l'activité */}
                </Link>
                : {new Date(activite.datetime_debut).toLocaleString()} 
                : {getTypeNom(activite.type_id)}
              </p>
              <button onClick={() => handleEdit(activite.id)} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Image src="/images/edit.png" alt="Edit" width={20} height={20} />
              </button>
            </div>
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