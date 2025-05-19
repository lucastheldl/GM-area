import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import {
  clearSessionCookie,
  setSessionCookie,
  generateToken,
} from "@/lib/auth";

export async function signup(email: string, password: string) {
  const existing = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existing.length > 0) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(userTable).values({ email, password: passwordHash });
}

export async function signIn(email: string, password: string) {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .then((res) => res[0]);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = await generateToken({ id: String(user.id), email: user.email });
  await setSessionCookie(token);
}

export async function logout() {
  await clearSessionCookie();
}
