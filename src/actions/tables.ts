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
export async function createTable(data: any) {
  const table = await db.insert(tableTable).values(data).returning();

  return { table };
}
