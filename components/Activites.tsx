"use client";

import { Activite } from "@/types/Activite";
import { useEffect, useState } from "react";


 
export default function Activites() {

    const [activites, setActivites] = useState<Activite[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getActivitesList = async () => {
        const response = await fetch("/api/activites"); // Call API
 
        if (!response.ok || response.status >= 300) {
            return <p>Une erreur est survenue</p>;
        }
        
        const activites = await response.json();

        console.log(activites);
        setActivites(activites);
        setIsLoading(false);
    }

    useEffect(() => {
        getActivitesList();
    }, []);

    if (isLoading) {
        return <p>Chargement...</p>;
    }

    return <>
        {activites.length > 0 ? (
            <>
                {activites.map((activite: Activite, i: number) => {
                    return (
                    <p key={i}>
                        {activite.nom} : {activite.datetime_debut.toString()} : {activite.description} : {activite.duree} : {activite.places_disponibles} : {activite.type_id}
                    </p>
                    );
                })};
            </>
        ) : (
            <p>Aucune réservation</p>
        )}
    </>
}