import { relations } from "drizzle-orm";
import { columnTable } from "./column";
import { rowTable } from "./rows";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const cellValues = pgTable("cell_values", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  rowId: integer().notNull().references(() => rowTable.id),
  columnId: integer().notNull().references(() => columnTable.id),
  value: varchar({ length: 2048 }), 
});
export const cellValuesRelations = relations(cellValues, ({ one }) => ({
  column: one(columnTable, {
    fields: [cellValues.columnId],
    references: [columnTable.id],
  }),
  row: one(rowTable, {
    fields: [cellValues.rowId],
    references: [rowTable.id],
  }),
}));