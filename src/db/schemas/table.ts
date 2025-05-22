import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { columnTable } from "./column";
import { rowTable } from "./rows";
import { relations } from "drizzle-orm";
import { gameTable } from "./game";

export const tableTable = pgTable("tables", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  game_id: integer()
    .notNull()
    .references(() => gameTable.id),
});
export const tablesRelations = relations(tableTable, ({ one, many }) => ({
  columns: many(columnTable),
  rows: many(rowTable),

  game: one(gameTable, {
    fields: [tableTable.game_id],
    references: [gameTable.id],
  }),
}));
