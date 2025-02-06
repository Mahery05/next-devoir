"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/utils/sessions";
import { useRouter } from "next/navigation";

const ProfilEditForm = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession();
      if (session?.rowid) {
        const response = await fetch(`/api/user/profil`);
        const data = await response.json();
        setUserData(data);
      } else {
        setError("Utilisateur non authentifié.");
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`/api/user/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      setError("Erreur mise à jour.");
    } else {
      setSuccess("Profil mis à jour !");
      setTimeout(() => router.push("/mon-profil"), 1000);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <label>Prénom :</label>
      <input type="text" name="prenom" value={userData?.prenom || ""} onChange={handleChange} />
      <label>Nom :</label>
      <input type="text" name="nom" value={userData?.nom || ""} onChange={handleChange} />
      <label>Email :</label>
      <input type="email" name="email" value={userData?.email || ""} onChange={handleChange} />
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default ProfilEditForm;
