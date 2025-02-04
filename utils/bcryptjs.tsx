import bcrypt from "bcryptjs";
 
export function hashPassword(motdepasse: string) {
  return bcrypt.hash(motdepasse, 10).then((hashedPassword: string) => {
    return hashedPassword;
  });
}

export function checkPassword(motdepasse: string, hashedPassword: string) {
  return bcrypt.compare(motdepasse, hashedPassword).then((isCorrect: boolean) => {
    return isCorrect;
  });
}