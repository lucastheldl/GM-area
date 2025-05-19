import { eq } from "drizzle-orm";
import { db } from "@/db";
import { gameTable } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function getUserGames() {
  const user = await getSession();

  if (!user) {
    throw new Error("User not authenticated");
  }
  const games = await db
    .select()
    .from(gameTable)
    .where(eq(gameTable.userId, Number(user.id)));

  return { games };
}
