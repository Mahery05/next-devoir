"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/sessions";
 
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
 
  const Logout = () => {
    logout(); // Destroy the cookie
    return router.push("/login"); // redirect to login page
  };

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }
 
  return (
    <nav>
        <Link
        href="/mon-profil"
        className={clsx("", {
          active: pathname === "/mon-profil",
        })}
      >
        Mon Profil
      </Link>
      <Link
        href="/mes-reservations"
        className={clsx("", {
          active: pathname === "/mes-reservations",
        })}
      >
        Mes réservations
      </Link>
      <Link
        href="/mes-reservations/create"
        className={clsx("", {
          active: pathname === "/mes-reservations/create",
        })}
      >
        Créer une réservation
      </Link>
      <Link
        href="/activites"
        className={clsx("", {
          active: pathname === "/activites",
        })}
      >
        Activites
      </Link>
      <Link
        href="/activites/create"
        className={clsx("", {
          active: pathname === "/activites/create",
        })}
      >
        Créer une activité
      </Link>
      <button onClick={Logout}>Logout</button>
    </nav>
  );
}