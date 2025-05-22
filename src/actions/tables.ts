import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { cellValues, columnTable, rowTable, tableTable } from "@/db/schema";

export async function getTablesFromGame(id: number) {
  const tables = await db
    .select()
    .from(tableTable)
    .where(eq(tableTable.game_id, id));

  return { tables };
}
export async function getTable(id: number) {
  const completeTable = await db.execute(
    sql`SELECT  
    t.id AS table_id,
    t.name AS table_name,
    
    c.id AS column_id,
    c.type AS column_type,
    c.order AS column_order,
    
    r.id AS row_id,
    
    cv.id AS cell_value_id,
    cv.value AS cell_value

    FROM tables t
    LEFT JOIN columns c ON c.table_id = t.id 
    LEFT JOIN rows r ON r.table_id = t.id 
    LEFT JOIN cell_values cv ON cv.column_id = c.id AND cv.row_id = r.id
    WHERE t.id = ${id}

    ORDER BY t.id, c.id, r.id;`
  );

  return { table: completeTable.rows[0] };
}
export async function createTable(data: any) {
  const table = await db.insert(tableTable).values(data).returning();

  return { table };
}

export async function createColumn(data: any) {
  const column = await db.insert(columnTable).values(data).returning();

  return { column };
}
