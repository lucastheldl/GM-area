import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { cellValues, columnTable, rowTable, tableTable } from "@/db/schema";
import type { NewCellValue } from "@/db/schemas/cell-values";
import type { Row as RowType } from "@/@types";

interface Column {
  id: number;
  tableId: number;
  name: string;
  type: string;
  order: number;
}

interface CellValue {
  id: number;
  value: string;
}

interface RowMapType {
  id: number;
  tableId: number;
  values: Record<number, CellValue>;
}

interface RawRow {
  table_id: number;
  table_name: string;
  column_id: number | null;
  column_name: string | null;
  column_type: string | null;
  column_order: number | null;
  row_id: number | null;
  cell_value_id: number | null;
  cell_value: string | null;
  [key: string]: unknown;
}

export async function getTablesFromGame(id: number) {
  const tables = await db
    .select()
    .from(tableTable)
    .where(eq(tableTable.game_id, id));

  return { tables };
}
export async function getTable(id: number): Promise<{
  table: {
    id: number;
    name: string;
    columns: Column[];
    rows: RowType[];
  };
  cellValues: {
    rowId: number;
    columnId: number;
    id: number;
    value: string;
  }[];
}> {
  const completeTable = await db.execute<RawRow>(
    sql`SELECT  
      t.id AS table_id,
      t.name AS table_name,
      
      c.id AS column_id,
      c.name AS column_name,
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

  const firstRow = completeTable.rows[0];
  if (!firstRow) {
    throw new Error("Table not found or is empty");
  }

  const table = {
    id: firstRow.table_id,
    name: firstRow.table_name,
    columns: [] as Column[],
    rows: [] as RowMapType[],
  };

  const columnsMap = new Map<number, Column>();
  const rowsMap = new Map<number, RowMapType>();

  const cellValues: {
    rowId: number;
    columnId: number;
    id: number;
    value: string;
  }[] = [];

  for (const row of completeTable.rows) {
    const {
      column_id,
      column_name,
      column_type,
      column_order,
      row_id,
      cell_value_id,
      cell_value,
    } = row;

    // Add column if it exists and hasn't been added yet
    if (
      column_id !== null &&
      column_name !== null &&
      column_type !== null &&
      column_order !== null &&
      !columnsMap.has(column_id)
    ) {
      columnsMap.set(column_id, {
        id: column_id,
        name: column_name,
        type: column_type,
        order: column_order,
        tableId: row.table_id,
      });
    }

    // Add row if it exists and hasn't been added yet
    if (row_id !== null && !rowsMap.has(row_id)) {
      rowsMap.set(row_id, {
        id: row_id,
        tableId: row.table_id,
        values: {},
      });
    }

    // Add cell value to both row.values and flat array
    if (
      row_id !== null &&
      column_id !== null &&
      cell_value_id !== null &&
      cell_value !== null
    ) {
      const rowEntry = rowsMap.get(row_id)!;
      rowEntry.values[column_id] = {
        id: cell_value_id,
        value: cell_value,
      };

      cellValues.push({
        rowId: row_id,
        columnId: column_id,
        id: cell_value_id,
        value: cell_value,
      });
    }
  }

  table.columns = [...columnsMap.values()].sort((a, b) => a.order - b.order);
  table.rows = [...rowsMap.values()];

  return { table, cellValues };
}

export async function createTable(data: any) {
  const table = await db.insert(tableTable).values(data).returning();

  const columnsWithTableId = data.columns.map((c: any) => ({
    ...c,
    table_id: table[0].id,
  }));

  const columns = await db
    .insert(columnTable)
    .values(columnsWithTableId)
    .returning();

  return { ...table[0], columns: columns };
}
export async function deleteTable(tableId: number) {
   await db.delete(tableTable).where(eq(tableTable.id,tableId));
}
export async function createImportedTable(data: any) {
  // Create the table
  const table = await db.insert(tableTable).values({
    name: data.name,
    game_id: data.game_id
  }).returning();

  const tableId = table[0].id;

  // Create columns with the new table ID
  const columnsWithTableId = data.columns.map((c: any) => ({
    name: c.name,
    type: c.type,
    order: c.order,
    table_id: tableId,
  }));

  const columns = await db
    .insert(columnTable)
    .values(columnsWithTableId)
    .returning();

  // Create a mapping from old column IDs to new column IDs
  const columnIdMap = new Map<number, number>();
  data.columns.forEach((originalCol: any, index: number) => {
    columnIdMap.set(originalCol.id, columns[index].id);
  });

  // Create rows with the new table ID
  const rowsWithTableId = data.rows.map((r: any) => ({
    table_id: tableId,
  }));

  const rows = await db
    .insert(rowTable)
    .values(rowsWithTableId)
    .returning();

  // Create a mapping from old row IDs to new row IDs
  const rowIdMap = new Map<number, number>();
  data.rows.forEach((originalRow: any, index: number) => {
    rowIdMap.set(originalRow.id, rows[index].id);
  });

  // Create cell values with the new row and column IDs
  const cellValuesWithNewIds = data.cellValues.map((cell: any) => ({
    row_id: rowIdMap.get(cell.rowId),
    column_id: columnIdMap.get(cell.columnId),
    value: String(cell.value), 
  })).filter((cell: any) => cell.row_id && cell.column_id);

  if (cellValuesWithNewIds.length > 0) {
    await db.insert(cellValues).values(cellValuesWithNewIds);
  }

  return { 
    table: table[0], 
    columns: columns,
    rows: rows,
    message: "Table imported successfully"
  };
}

export async function createColumn(data: any) {
  const column = await db.insert(columnTable).values(data).returning();

  return { column };
}

export async function createRow(data: any) {
  const row = await db.insert(rowTable).values(data).returning();

  return { row };
}
export async function deleteColumn(id: number) {
  await db.delete(columnTable).where(eq(columnTable.id,id));

  
}
export async function deleteRows(tableId:number) {
  await db.delete(rowTable).where(eq(rowTable.table_id,tableId));
}
export async function createCells(data: Omit<NewCellValue, "id">[]) {
  const cells = await db.insert(cellValues).values(data).returning();

  return { cells };
}
export async function editCells(data: any) {
  const cell = await db
    .update(cellValues)
    .set({ value: data.value })
    .where(eq(cellValues.id, data.id));

  return { cell };
}
