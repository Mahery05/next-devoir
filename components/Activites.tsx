"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Utilisez 'next/navigation' au lieu de 'next/router'
import { supabase } from '../lib/supabaseClient';
import { Activite } from '@/types/Activite';
import { TypeActivite } from '@/types/TypeActivite';
import Link from 'next/link';
import Image from 'next/image';

// Fonction pour récupérer les données d'activités et de types d'activités
const fetchActivitesData = async () => {
  const { data: activitesData, error: activitesError } = await supabase
    .from('activites')
    .select('*');

  const { data: typeActivitesData, error: typeActivitesError } = await supabase
    .from('type_activite')
    .select('*');

  if (activitesError || typeActivitesError) {
    throw new Error('Erreur lors du chargement des données');
  }

  return { activitesData, typeActivitesData };
};

const Activites = () => {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [typeActivites, setTypeActivites] = useState<TypeActivite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { activitesData, typeActivitesData } = await fetchActivitesData();
        setActivites(activitesData);
        setTypeActivites(typeActivitesData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les activités en fonction du nom
  const filteredActivites = activites.filter(activite =>
    activite.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/activite/${id}`, {
        method: 'DELETE', 
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'activité');
      }

      alert('Activité supprimée avec succès');
      setActivites(activites.filter(activite => activite.id !== id)); // Retirer l'activité supprimée de la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Une erreur est survenue lors de la suppression');
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Rechercher par nom"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '100%', fontSize: '16px' }}
      />
      {filteredActivites.length > 0 ? (
        <>
          {filteredActivites.map((activite: Activite, i: number) => {
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
                <button onClick={() => handleDelete(activite.id)} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Image src="/images/delete.png" alt="Delete" width={20} height={20} />
                </button>
              </div>
            );
          })}
        </>
      ) : (
        <p>Aucune activité trouvée</p>
      )}
    </>
  );
};

export default Activites;
