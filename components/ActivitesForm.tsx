"use client";

import { useState, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";

export default function ActivitesForm() {
  const [error, setError] = useState<JSX.Element | null>(null);
  const [success, setSuccess] = useState<JSX.Element | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêcher la soumission du formulaire par défaut

    // Récupérer la valeur du champ 'nom'
    const nom = e.currentTarget.nom.value.trim();
    const datetime_debut = e.currentTarget.datetime_debut.value.trim();
    const duree = e.currentTarget.duree.value.trim();
    const description = e.currentTarget.description.value.trim();
    const places_disponibles = e.currentTarget.places_disponibles.value.trim();
    const type_id = e.currentTarget.type_id.value.trim();

    // Vérifier si le champ est vide
    if (nom === "" || datetime_debut === "" || duree === "" || description === "" || places_disponibles === "" || type_id === "") {
      setError(<p>Le champ nom est requis</p>);
      return;
    }

    try {
      // Envoyer une requête POST vers l'API de création de type_activite
      const response = await fetch("/api/activites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
        }),
      });

      // Vérifier si la requête a échoué
      if (!response.ok) {
        const { message } = await response.json();
        setError(<p>{message}</p>);
        return;
      }

      // Réinitialiser le formulaire et afficher un message de succès
      e.currentTarget.reset();
      setError(null);
      setSuccess(<p>activité créé avec succès !</p>);
      router.refresh(); // Actualiser la page si nécessaire
    } catch (error) {
      console.error(error);
      setError(<p>Une erreur s&apos;est produite lors de la création activité</p>);
    }
  };

  return (
    <>
      <form method="POST" onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom : </label>
        <input
          type="text"
          name="nom"
          id="nom"
          placeholder="Ex: Yoga"
        />
        <br />
        <label htmlFor="datetime_debut">Date de début : </label>
        <input
          type="datetime-local"
          name="datetime_debut"
          id="datetime_debut"
          placeholder="Ex: 2022-01-01T00:00"
        />
        <br />
        <label htmlFor="duree">Durée : </label>
        <input
          type="text"
          name="duree"
          id="duree"
          placeholder="Ex: 1h"
        />
        <br />
        <label htmlFor="description">Description : </label>
        <input
          type="text"
          name="description"
          id="description"
          placeholder="Ex: Cours de yoga"
        />
        <br />
        <label htmlFor="places_disponibles">Places disponibles : </label>
        <input
          type="number"
          name="places_disponibles"
          id="places_disponibles"
          placeholder="Ex: 10"
        />
        <br />
        <label htmlFor="type_id">Type d&apos;activité : </label>
        <input
          type="number"
          name="type_id"
          id="type_id"
          placeholder="Ex: 1"
        />
        <input type="submit" name="creer" value="Créer type d'activité" />
      </form>
      {error && error}
      {success && success}
    </>
  );
}
