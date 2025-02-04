"use server";
 
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
 
const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
 
// Create the JWT
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Date.now() + 60 * 1000) // JWT expiration (1 minute)
    .sign(key);
}
 
// Read the JWT
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Session expired" }, { status: 403 })
  }
}
 
// Create the cookie
export async function createCookie(sessionData: object) {
  const encryptedSessionData = await encrypt(sessionData);
  const cookie = await cookies();
 
  cookie.set("session", encryptedSessionData, {
    httpOnly: true,
    secure: false,
    path: "/",
  });
}
 
// Destroy the cookie
export async function logout() {
  const cookie = await cookies();
  // Destroy the session
  cookie.set("session", "", { expires: new Date(0) });
}
 
// Read the cookie
export async function getSession() {
  const cookie = await cookies();
  const session = cookie.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}