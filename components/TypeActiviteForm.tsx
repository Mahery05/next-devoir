"use client";

import { useState, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";

export default function TypeActiviteForm() {
  const [error, setError] = useState<JSX.Element | null>(null);
  const [success, setSuccess] = useState<JSX.Element | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêcher la soumission du formulaire par défaut

    // Récupérer la valeur du champ 'nom'
    const nom = e.currentTarget.nom.value.trim();

    // Vérifier si le champ est vide
    if (nom === "") {
      setError(<p>Le champ nom est requis</p>);
      return;
    }

    try {
      // Envoyer une requête POST vers l'API de création de type_activite
      const response = await fetch("/api/type_activite", {
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
      setSuccess(<p>Type d&apos;activité créé avec succès !</p>);
      router.refresh(); // Actualiser la page si nécessaire
    } catch (error) {
      console.error(error);
      setError(<p>Une erreur s&apos;est produite lors de la création du type d&apos;activité</p>);
    }
  };

  return (
    <>
      <form method="POST" onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom du type d&apos;activité : </label>
        <input
          type="text"
          name="nom"
          id="nom"
          placeholder="Ex: Yoga"
        />
        <br />
        <input type="submit" name="creer" value="Créer type d'activité" />
      </form>
      {error && error}
      {success && success}
    </>
  );
}
