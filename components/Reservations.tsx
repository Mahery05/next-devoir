"use client";

import { Activite } from "@/types/Activite";
import { Reservation } from "@/types/Reservation";
import { useEffect, useState } from "react";

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activites, setActivites] = useState<Activite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getReservationsList = async () => {
    try {
      const [reservationsResponse, activitesResponse] = await Promise.all([
        fetch("/api/reservations"),
        fetch("/api/activites"),
      ]);

      if (!reservationsResponse.ok || !activitesResponse.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const reservations = await reservationsResponse.json();
      const activites = await activitesResponse.json();

      setReservations(reservations);
      setActivites(activites);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    getReservationsList();
  }, []);

  // Fonction pour changer l'état de la réservation (ex: de TRUE à FALSE)
  const toggleReservationState = async (id: number, currentState: boolean) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newEtat: !currentState }), // Passer la nouvelle valeur
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        console.error("🔴 Erreur API :", errorMessage);
        throw new Error("Erreur lors de la mise à jour");
      }
  
      const updatedReservation = await response.json();
      console.log("✅ Réservation mise à jour :", updatedReservation);
  
      // Mise à jour locale de l'état
      setReservations((prevReservations) =>
        prevReservations.map((r) =>
          r.id === id ? { ...r, etat: !currentState } : r
        )
      );
    } catch (error) {
      console.error("🔴 Erreur :", error);
    }
  };  

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  return (
    <>
      {reservations.length > 0 ? (
        <>
          {reservations.map((reservation: Reservation, i: number) => {
            const activite = activites.find((a) => a.id === reservation.activite_id);
            return (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <p>
                  {reservation.datereservation.toString()} :{" "}
                  {reservation.etat ? "Confirmée" : "Annulée"} :{" "}
                  {activite ? activite.nom : "Activité inconnue"}
                </p>
                <button
                  onClick={() => reservation.id !== undefined && toggleReservationState(reservation.id, reservation.etat)}
                  style={{
                    backgroundColor: reservation.etat ? "red" : "green",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  {reservation.etat ? "Annuler la réservation" : "Activer la réservation"}
                </button>
              </div>
            );
          })}
        </>
      ) : (
        <p>Aucune réservation</p>
      )}
    </>
  );
}