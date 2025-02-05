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
        fetch("/api/reservations"), // Call API for reservations
        fetch("/api/activites"), // Call API for activities
      ]);

      if (!reservationsResponse.ok || !activitesResponse.ok ) {
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
              <p key={i}>
                {reservation.datereservation.toString()} : {reservation.etat} : {activite ? activite.nom : "Activité inconnue"} 
              </p>
            );
          })}
        </>
      ) : (
        <p>Aucune réservation</p>
      )}
    </>
  );
}
