import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { gameTable, tableTable } from "@/db/schema";
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

  const gamesWithTables = await Promise.all(
    games.map(async (game) => {
      const tables = await db
        .select()
        .from(tableTable)
        .where(eq(tableTable.gameId, game.id));

      return {
        ...game,
        tables,
      };
    })
  );

  return { gamesWithTables };
}
export async function getGame(id: string) {
  const user = await getSession();

  if (!user) {
    throw new Error("User not authenticated");
  }
  const game = await db
    .select()
    .from(gameTable)
    .where(
      and(eq(gameTable.id, Number(id)), eq(gameTable.userId, Number(user.id)))
    );

  return { game };
}
export async function createGame(data: any) {
  const user = await getSession();

  if (!user) {
    throw new Error("User not authenticated");
  }

  await db
    .insert(gameTable)
    .values({ ...data, userId: user.id })
    .returning();
}
