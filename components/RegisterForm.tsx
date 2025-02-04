"use client";
 
import { hashPassword } from "@/utils/bcryptjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
 
export default function RegisterForm() {
  const [error, setError] = useState(<></>);
  const router = useRouter();
 
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
 
    // Get data from form
    const nom = e.currentTarget.nom.value.trim();
    const prenom = e.currentTarget.prenom.value.trim();
    const email = e.currentTarget.email.value.trim();
    const motdepasse = e.currentTarget.motdepasse.value.trim();
    const roleElement = e.currentTarget.elements.namedItem("role") as HTMLInputElement;
    const role = roleElement ? roleElement.value.trim() : "";
    // If any data is empty
    if (
      nom == "" ||
      prenom == "" ||
      email == "" ||
      motdepasse == "" ||
        role == ""
    ) {
      setError(<p>All fields are required</p>);
    } else {
      try {
        const hashedPassword = await hashPassword(motdepasse); // Hash password
        // Fetch "/api/register" route
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom,
            prenom,
            email,
            motdepasse: hashedPassword,
            role
          }),
        });
        // If there is an error (user already exists for exemple)
        if (!response.ok || response.status >= 300) {
          const { message } = await response.json();
          setError(<p>{message}</p>);
        } else {
          router.push("/login"); // Redirect to login page
        }
      } catch (error) {
        console.error(error);
        setError(<p>An error occured</p>);
      }
    }
  };
 
  return (
    <>
      <form method="POST" onSubmit={handleRegister}>
        <label htmlFor="nom">Nom : </label>
        <input type="text" name="nom" id="nom" placeholder="John" />
        <br />
        <label htmlFor="prenom">Prénom : </label>
        <input type="text" name="prenom" id="prenom" placeholder="Doe" />
        <br />
        <label htmlFor="email">Email : </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="john.doe@gmail.com"
        />
        <br />
        <label htmlFor="motdepasse">Mot de passe : </label>
        <input type="password" name="motdepasse" id="motdepasse" />
        <br />
        <label htmlFor="role">Role : </label>
        <select name="role" id="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input type="submit" name="register" value="Register" />
      </form>
      {error && error}
    </>
  );
}