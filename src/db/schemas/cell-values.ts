import { InferModel, relations } from "drizzle-orm";
import { columnTable } from "./column";
import { rowTable } from "./rows";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const cellValues = pgTable("cell_values", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  row_id: integer()
    .notNull()
    .references(() => rowTable.id, { onDelete: "cascade" }),
  column_id: integer()
    .notNull()
    .references(() => columnTable.id, { onDelete: "cascade" }),
  value: varchar({ length: 2048 }),
 // content: text().default(""),
});
export const cellValuesRelations = relations(cellValues, ({ one }) => ({
  column: one(columnTable, {
    fields: [cellValues.column_id],
    references: [columnTable.id],
  }),
  row: one(rowTable, {
    fields: [cellValues.row_id],
    references: [rowTable.id],
  }),
}));

export type CellValuesType = typeof cellValues.$inferInsert;
export type NewCellValue = typeof cellValues.$inferSelect;
