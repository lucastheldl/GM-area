"use server"
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
    .where(eq(gameTable.user_id, Number(user.id)));

  const gamesWithTables = await Promise.all(
    games.map(async (game) => {
      const tables = await db
        .select()
        .from(tableTable)
        .where(eq(tableTable.game_id, game.id));

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
      and(eq(gameTable.id, Number(id)), eq(gameTable.user_id, Number(user.id)))
    );

  const tables = await db
    .select()
    .from(tableTable)
    .where(eq(tableTable.game_id, Number(id)));

  const gameWithTables = { ...game[0], tables };

  return { game: gameWithTables };
}
export async function createGame(data: any) {
  const user = await getSession();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const createdGame = await db
    .insert(gameTable)
    .values({ ...data, user_id: user.id })
    .returning();

  return { game: { ...createdGame[0], tables: [] } };
}
export async function deleteGame(id: number) {
  await db.delete(gameTable).where(eq(gameTable.id, id));

  //TODO: delete columns and rows and values and tables
}
