import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { tableTable } from "./table";
import { relations } from "drizzle-orm";
import { cellValues } from "./cell-values";

export const columnTable = pgTable("columns", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  table_id: integer()
    .notNull()
    .references(() => tableTable.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 50 }).notNull(),
  order: integer().notNull(),
});
export const columnRelations = relations(columnTable, ({ one, many }) => ({
  table: one(tableTable, {
    fields: [columnTable.table_id],
    references: [tableTable.id],
  }),
  cellValues: many(cellValues),
}));
