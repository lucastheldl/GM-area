ALTER TABLE "cell_values" DROP CONSTRAINT "cell_values_row_id_rows_id_fk";
--> statement-breakpoint
ALTER TABLE "cell_values" DROP CONSTRAINT "cell_values_column_id_columns_id_fk";
--> statement-breakpoint
ALTER TABLE "columns" DROP CONSTRAINT "columns_table_id_tables_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "games_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rows" DROP CONSTRAINT "rows_table_id_tables_id_fk";
--> statement-breakpoint
ALTER TABLE "tables" DROP CONSTRAINT "tables_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "cell_values" ADD CONSTRAINT "cell_values_row_id_rows_id_fk" FOREIGN KEY ("row_id") REFERENCES "public"."rows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cell_values" ADD CONSTRAINT "cell_values_column_id_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."columns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "columns" ADD CONSTRAINT "columns_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rows" ADD CONSTRAINT "rows_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tables" ADD CONSTRAINT "tables_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;