import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { cellValues, columnTable, rowTable, tableTable } from "@/db/schema";


interface Column{
  id:number, tableId:number, name:string, type:string, order:number
}
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

  const table = {
    id: completeTable.rows[0].table_id,
    name: completeTable.rows[0].table_name,
    columns: [] as Column[],
    rows: [],
  };

  const columnsMap = new Map();
  const rowsMap = new Map();

  for (const row of completeTable.rows) {
    // Add column if not already added
    if (row.column_id !== null && !columnsMap.has(row.column_id)) {
      columnsMap.set(row.column_id, {
        id: row.column_id,
        type: row.column_type,
        order: row.column_order,
      });
    }

    // Add row if not already added
    if (row.row_id !== null && !rowsMap.has(row.row_id)) {
      rowsMap.set(row.row_id, {
        id: row.row_id,
        values: {},
      });
    }

    // Add cell value
    if (row.row_id !== null && row.column_id !== null && row.cell_value_id !== null) {
      const rowEntry = rowsMap.get(row.row_id);
      rowEntry.values[row.column_id] = {
        id: row.cell_value_id,
        value: row.cell_value,
      };
    }
  }

  // Assign sorted columns and rows
  table.columns = [...columnsMap.values()].sort((a, b) => a.order - b.order) as Column[];
  table.rows = [...rowsMap.values()];
  return { table };
}
export async function createTable(data: any) {
  const table = await db.insert(tableTable).values(data).returning();

  return { table };
}

export async function createColumn(data: any) {
  const column = await db.insert(columnTable).values(data).returning();

  return { column };
}

export async function createRow(data: any) {
  const row = await db.insert(rowTable).values(data).returning();

  return { row };
}
export async function createCells(data: any) {
  const cells = await db.insert(rowTable).values(data).returning();

  return { cells };
}

