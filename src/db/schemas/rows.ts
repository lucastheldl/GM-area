import { relations } from "drizzle-orm";
import { columnTable } from "./column";
import { tableTable } from "./table";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { cellValues } from "./cell-values";

export const rowTable = pgTable("rows", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  table_id: integer()
    .notNull()
    .references(() => tableTable.id, { onDelete: "cascade" }),
});

export const rowsRelations = relations(rowTable, ({ one, many }) => ({
  table: one(tableTable, {
    fields: [rowTable.table_id],
    references: [tableTable.id],
  }),
  cellValues: many(cellValues),
}));
