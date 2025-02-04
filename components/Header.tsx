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
 
  return (
    <nav>
      <Link
        href="/mes-reservations"
        className={clsx("", {
          active: pathname === "/mes-reservations",
        })}
      >
        Mes réservations
      </Link>
      <Link
        href="/mes-reservations/profil"
        className={clsx("", {
          active: pathname === "/mes-reservations/profil",
        })}
      >
        Mon profil
      </Link>
      <button onClick={Logout}>Logout</button>
    </nav>
  );
}