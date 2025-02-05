"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Activite } from "@/types/Activite";
import { TypeActivite } from "@/types/TypeActivite";
import Image from "next/image";

const ActiviteEditForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const [activite, setActivite] = useState<Activite | null>(null);
  const [typeActivites, setTypeActivites] = useState<TypeActivite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const getData = async () => {
    const response = await fetch(`/api/activite/edit/${id}`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données.");
    }

    const data = await response.json();
    setActivite(data);

    const type_response = await fetch(`/api/type_activite`);

    if (!type_response.ok) {
      throw new Error("Erreur lors de la récupération des types d'activités.");
    }

    const types = await type_response.json();
    setTypeActivites(types);

    setLoading(false);
  }

  useEffect(() => {
    if (!id) {
      setError("ID d'activité manquant.");
      setLoading(false);
      return;
    }

    getData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!activite) return;

    const { name, value } = e.target;
    setActivite({ ...activite, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!activite) return;

    try {
      const response = await fetch(`/api/activite/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activite),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'activité");
      }

      setSuccess("Activité mise à jour avec succès !");
      setTimeout(() => {
        router.push("/activites"); // Redirection après succès
      }, 1000);
    } catch {
      setError("Une erreur s'est produite lors de la mise à jour de l'activité.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!activite) return <p>Aucune activité trouvée</p>;

  return (
    <div>
      <h2>Modifier l&apos;activité</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom :</label>
        <input type="text" name="nom" value={activite.nom || ""} onChange={handleChange} />

        <label>Date de début :</label>
        <input
          type="datetime-local"
          name="datetime_debut"
          value={activite.datetime_debut ? new Date(activite.datetime_debut).toISOString().slice(0, 16) : ""}
          onChange={handleChange}
        />

        <label>Durée :</label>
        <input type="text" name="duree" value={activite.duree || ""} onChange={handleChange} />

        <label>Description :</label>
        <input type="text" name="description" value={activite.description || ""} onChange={handleChange} />

        <label>Places disponibles :</label>
        <input type="number" name="places_disponibles" value={activite.places_disponibles || ""} onChange={handleChange} />

        <label>Type d&apos;activité :</label>
        <select name="type_id" value={activite.type_id || ""} onChange={handleChange}>
          <option value="">Sélectionner un type</option>
          {typeActivites.map((type) => (
            <option key={type.id} value={type.id}>
              {type.nom}
            </option>
          ))}
        </select>

        <button type="submit">Mettre à jour</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      
    </div>
  );
};

export default ActiviteEditForm;
