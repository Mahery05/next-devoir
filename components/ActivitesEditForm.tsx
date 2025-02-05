"use client";

import React, { useState, useEffect, FormEvent, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../lib/supabaseClient';
import { TypeActivite } from "@/types/TypeActivite";

interface ActivitesEditFormProps {
  id: number;
}

export default function ActivitesEditForm({ id }: ActivitesEditFormProps) {
  const [activite, setActivite] = useState<any>(null);
  const [typeActivites, setTypeActivites] = useState<TypeActivite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReactNode>(null);
  const [success, setSuccess] = useState<ReactNode>(null);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: activiteData, error: activiteError } = await supabase
          .from("activites")
          .select("*")
          .eq("id", id)
          .single();

        if (activiteError) {
          setError(<p>Erreur lors du chargement de l&apos;activité</p>);
          setLoading(false);
          return;
        }

        setActivite(activiteData);

        const { data: typeActivitesData, error: typeActivitesError } = await supabase
          .from("type_activite")
          .select("*");

        if (typeActivitesError) {
          setError(<p>Erreur lors du chargement des types d&apos;activités</p>);
          setLoading(false);
          return;
        }

        setTypeActivites(typeActivitesData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError(<p>Erreur lors du chargement des données</p>);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivite({ ...activite, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const nom = formData.get("nom")?.toString().trim() || "";
    const datetime_debut = formData.get("datetime_debut")?.toString().trim() || "";
    const duree = formData.get("duree")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const places_disponibles = formData.get("places_disponibles")?.toString().trim() || "";
    const type_id = formData.get("type_id")?.toString().trim() || "";

    if (!nom || !datetime_debut || !duree || !description || !places_disponibles || !type_id) {
      setError(<p>Veuillez remplir tous les champs.</p>);
      setSuccess(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("activites")
        .update({ nom, datetime_debut, duree, description, places_disponibles, type_id })
        .eq("id", id);

      if (error) {
        setError(<p>Erreur lors de la mise à jour de l&apos;activité</p>);
        return;
      }

      setError(null);
      setSuccess(<p>Activité mise à jour avec succès !</p>);
      router.refresh(); // Actualiser la page si nécessaire
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l&apos;activité:", error);
      setError(<p>Une erreur s&apos;est produite lors de la mise à jour de l&apos;activité</p>);
    }
  };

  if (loading) return <div>Chargement...</div>;

  if (!activite) return <div>Erreur lors du chargement de l&apos;activité</div>;

  return (
    <>
      <form ref={formRef} method="POST" onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom : </label>
        <input
          type="text"
          name="nom"
          id="nom"
          value={activite.nom}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="datetime_debut">Date de début : </label>
        <input
          type="datetime-local"
          name="datetime_debut"
          id="datetime_debut"
          value={activite.datetime_debut}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="duree">Durée : </label>
        <input
          type="text"
          name="duree"
          id="duree"
          value={activite.duree}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="description">Description : </label>
        <input
          type="text"
          name="description"
          id="description"
          value={activite.description}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="places_disponibles">Places disponibles : </label>
        <input
          type="number"
          name="places_disponibles"
          id="places_disponibles"
          value={activite.places_disponibles}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="type_id">Type d&apos;activité :</label>
        <select
          name="type_id"
          id="type_id"
          value={activite.type_id}
          onChange={handleChange}
        >
          <option value="">Sélectionner un type</option>
          {typeActivites.map((typeActivite) => (
            <option key={typeActivite.id} value={typeActivite.id}>
              {typeActivite.nom}
            </option>
          ))}
        </select>
        <br />
        <input type="submit" value="Mettre à jour l&apos;activité" />
      </form>
      {error && error}
      {success && success}
    </>
  );
}