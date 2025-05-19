import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tableTable } from "@/db/schema";

export async function getTablesFromGame(id: number) {
  const tables = await db
    .select()
    .from(tableTable)
    .where(eq(tableTable.gameId, id));

  return { tables };
}
