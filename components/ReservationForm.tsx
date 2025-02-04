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
    const form = e.currentTarget;
    const datereservation = e.currentTarget.datereservation.value.trim();
    const etat = e.currentTarget.etat.value.trim();
    const activite_id = e.currentTarget.activite_id.value.trim();
    const user_id = e.currentTarget.user_id.value.trim();

    // Vérifier si le champ est vide
    if (datereservation === "" || etat === "" || activite_id === "" || user_id === "") {
      setError(<p>Tous les champs ne sont pas remplis</p>);
      return;
    }

    try {
      // Envoyer une requête POST vers l'API de création de type_activite
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            datereservation,
            etat,
            activite_id,
            user_id
        }),
      });

      // Vérifier si la requête a échoué
      if (!response.ok) {
        const { message } = await response.json();
        setError(<p>{message}</p>);
        return;
      }

      // Réinitialiser le formulaire et afficher un message de succès
      if (form) {
        form.reset();
      }
      setError(null);
      setSuccess(<p>reservation créé avec succès !</p>);
      router.refresh(); // Actualiser la page si nécessaire
    } catch (error) {
      console.error(error);
      setError(<p>Une erreur s&apos;est produite lors de la création activité</p>);
    }
  };

  return (
    <>
      <form method="POST" onSubmit={handleSubmit}>
        <label htmlFor="datereservation">Date de reservation</label>
        <input
          type="datetime-local"
          name="datereservation"
          id="datereservation"
          placeholder="Ex: 2022-01-01T00:00"
        />
        <br />
        <label htmlFor="datetime_debut">Etat : </label>
        <input
          type="checkbox"
          name="etat"
          id="etat"
          placeholder="Ex: 1"
        />
        <br />
        <label htmlFor="duree">Activite </label>
        <input
          type="number"
          name="activite_id"
          id="activite_id"
          placeholder="Ex: 1"
        />
        <br />
        <label htmlFor="description">User </label>
        <input
          type="number"
          name="user_id"
          id="user_id"
          placeholder="Ex: 1"
        />
        <br />
        <input type="submit" name="creer" value="Créer une reservation" />
      </form>
      {error && error}
      {success && success}
    </>
  );
}
