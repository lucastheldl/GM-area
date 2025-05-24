import { relations } from "drizzle-orm";
import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./users";
import { tableTable } from "./table";

export const gameTable = pgTable("games", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  user_id: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow(),
});

export const rowsRelations = relations(gameTable, ({ one, many }) => ({
  userTable: one(userTable, {
    fields: [gameTable.user_id],
    references: [userTable.id],
  }),
  tables: many(tableTable),
}));
