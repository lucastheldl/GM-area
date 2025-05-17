"use server"

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;


export async function setSessionCookie(token: string) {
  const sessionCookie =await cookies();
  sessionCookie.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 7 days
  });
}

export async function clearSessionCookie() {
  const sessionCookie =await cookies();
  sessionCookie.set("session", "", { expires: new Date(0), path: "/" });
}

export async function getSession() {
  const sessionCookie =await cookies();
  const currentSessionCookie = sessionCookie.get("session")?.value;
  if (!currentSessionCookie) return null;

  try {
    const payload = jwt.verify(currentSessionCookie, JWT_SECRET) as {
      id: string;
      email: string;
    };
    return payload;
  } catch {
    return null;
  }
}
