import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./users";
import { tableTable } from "./table";

export const gameTable = pgTable("games", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  userId: integer().notNull().references(() => userTable.id),
});

export const rowsRelations = relations(gameTable, ({ one,many }) => ({
 
  userTable: one(userTable, {
    fields: [gameTable.userId],
    references: [userTable.id],
  }),
  tables: many(tableTable),
}));