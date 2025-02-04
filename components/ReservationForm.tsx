"use client";

import { useState, useEffect, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { Activite } from "@/types/Activite";



export default function ReservationForm() {
  const [error, setError] = useState<JSX.Element | null>(null);
  const [success, setSuccess] = useState<JSX.Element | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activites, setActivites] = useState<Activite[]>([]);
  const router = useRouter();

  // Récupérer la liste des utilisateurs et des activités depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, activitesResponse] = await Promise.all([
          fetch("/api/user"), // Remplacez par votre endpoint API réel pour récupérer les utilisateurs
          fetch("/api/activites"), // Remplacez par votre endpoint API réel pour récupérer les activités
        ]);

        const usersData = await usersResponse.json();
        const activitesData = await activitesResponse.json();

        setUsers(usersData);
        setActivites(activitesData);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs ou des activités:", error);
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
    const user_id = e.currentTarget.user_id.value;

    // Vérifier si tous les champs sont remplis
    if (datereservation === "" || activite_id === "" || user_id === "") {
      setError(<p>Tous les champs ne sont pas remplis</p>);
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
          user_id: Number(user_id),
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

        {/* Sélection des utilisateurs */}
        <label htmlFor="user_id">Utilisateur</label>
        <select name="user_id" id="user_id">
          <option value="">Sélectionner un utilisateur</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nom}
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

