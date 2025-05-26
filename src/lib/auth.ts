"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;
const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

export async function generateToken(payload: { id: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey);
  return payload as { id: string; email: string };
}

export async function setSessionCookie(token: string) {
  const sessionCookie = await cookies();
  sessionCookie.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookie() {
  const sessionCookie = await cookies();
  sessionCookie.set("session", "", { expires: new Date(0), path: "/" });
}

export async function getSession() {
  const sessionCookie = await cookies();
  const token = sessionCookie.get("session")?.value;
  if (!token) return null;

  try {
    const user = await verifyToken(token);
    return user;
  } catch {
    return null;
  }
}
