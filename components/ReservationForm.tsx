"use client";

import { useState, useEffect, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import { Activite } from "@/types/Activite";
import { getSession } from "@/utils/sessions"; // Assure-toi que ce chemin est correct

export default function ReservationForm() {
  const [error, setError] = useState<JSX.Element | null>(null);
  const [success, setSuccess] = useState<JSX.Element | null>(null);
  const [activites, setActivites] = useState<Activite[]>([]);
  const [userSession, setUserSession] = useState<any>(null); // Utiliser any ou un typage plus précis pour la session utilisateur
  const router = useRouter();

  // Récupérer les activités depuis l'API et les infos de session
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les activités
        const activitesResponse = await fetch("/api/activites");
        const activitesData = await activitesResponse.json();
        setActivites(activitesData);

        // Récupérer la session utilisateur
        const sessionData = await getSession();
        setUserSession(sessionData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError(<p>Erreur lors du chargement des données</p>);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêcher la soumission du formulaire par défaut

    const form = e.currentTarget;
    const datereservation = e.currentTarget.datereservation.value.trim();
    const etat = e.currentTarget.etat.checked ? "1" : "0"; // Convertir la checkbox en booléen
    const activite_id = e.currentTarget.activite_id.value;

    // Vérifier si tous les champs sont remplis
    if (datereservation === "" || activite_id === "") {
      setError(<p>Tous les champs ne sont pas remplis</p>);
      return;
    }

    // Assurer que la session utilisateur est chargée avant de créer la réservation
    if (!userSession) {
      setError(<p>Erreur : utilisateur non connecté</p>);
      return;
    }

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          datereservation,
          etat,
          activite_id: Number(activite_id),
          user_id: userSession.rowid, // Utiliser l'ID de l'utilisateur connecté
          user_nom: userSession.nom,  // Facultatif : inclure le nom de l'utilisateur
        }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError(<p>{message}</p>);
        return;
      }

      if (form) {
        form.reset();
      }
      setError(null);
      setSuccess(<p>Réservation créée avec succès !</p>);
      router.refresh(); // Actualiser la page si nécessaire
    } catch (error) {
      console.error(error);
      setError(<p>Une erreur s&apos;est produite lors de la création de la réservation</p>);
    }
  };

  return (
    <>
      <form method="POST" onSubmit={handleSubmit}>
        <label htmlFor="datereservation">Date de réservation</label>
        <input
          type="datetime-local"
          name="datereservation"
          id="datereservation"
          placeholder="Ex: 2022-01-01T00:00"
        />
        <br />
        <label htmlFor="etat">État : </label>
        <input
          type="checkbox"
          name="etat"
          id="etat"
        />
        <br />

        {/* Sélection des activités */}
        <label htmlFor="activite_id">Activité</label>
        <select name="activite_id" id="activite_id">
          <option value="">Sélectionner une activité</option>
          {activites.map((activite) => (
            <option key={activite.id} value={activite.id}>
              {activite.nom}
            </option>
          ))}
        </select>
        <br />

        <input type="submit" name="creer" value="Créer une réservation" />
      </form>
      {error && error}
      {success && success}
    </>
  );
}
