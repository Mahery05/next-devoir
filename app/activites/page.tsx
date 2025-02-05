import Activites from "@/components/Activites";
import { Suspense } from "react";

export default function ActivitesPage() {
  return (
    <>
      <h2>Activités</h2>
      <Suspense fallback={<p>Chargement...</p>}>
        <Activites />
      </Suspense>
    </>
  );
}
