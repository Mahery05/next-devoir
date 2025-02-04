"use client";

import { Reservation } from "@/types/Reservation";
import { useEffect, useState } from "react";


 
export default function Reservations() {

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getReservationsList = async () => {
        const response = await fetch("/api/reservations"); // Call API
 
        if (!response.ok || response.status >= 300) {
            return <p>Une erreur est survenue</p>;
        }
        
        const reservations = await response.json();

        console.log(reservations);
        setReservations(reservations);
        setIsLoading(false);
    }

    useEffect(() => {
        getReservationsList();
    }, []);

    if (isLoading) {
        return <p>Chargement...</p>;
    }

    return <>
        {reservations.length > 0 ? (
            <>
                {reservations.map((reservation: Reservation, i: number) => {
                    return (
                    <p key={i}>
                        {reservation.datereservation.toString()} : {reservation.etat} : {reservation.activite_id} : {reservation.user_id}
                    </p>
                    );
                })};
            </>
        ) : (
            <p>Aucune réservation</p>
        )}
    </>
}