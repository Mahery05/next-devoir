"use server";
 
export default async function ReservationForm() {
  return (
    <form>
      <label htmlFor="datereservation">Date de reservation : </label>
      <input
        type="date"
        name="datereservation"
        id="datereservation"
        placeholder="date de reservation"
      />
      <br />
      <label htmlFor="skill_level">Niveau : Etat </label>
      <br />
      <input
        type="range"
        name="skill_level"
        id="skill_level"
        min="1"
        max="5"
        step="1"
      />
      <br />
      <input type="submit" name="skill_add" value="Ajouter" />
    </form>
  );
}