import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { tableTable } from "./table";
import { relations } from "drizzle-orm";
import { cellValues } from "./cell-values";

export const columnTable = pgTable("columns", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tableId: integer().notNull().references(() => tableTable.id),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 50 }).notNull(), // e.g., 'text', 'number', etc.
  order: integer().notNull(), // for column ordering
});
export const columnRelations = relations(columnTable, ({ one,many }) => ({
 
  table: one(tableTable, {
    fields: [columnTable.tableId],
    references: [tableTable.id],
  }),
  cellValues: many(cellValues),
}));