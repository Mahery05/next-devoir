import bcrypt from "bcryptjs";
 
export function hashPassword(motdepasse: string) {
  return bcrypt.hash(motdepasse, 10).then((hashedPassword: string) => {
    return hashedPassword;
  });
}