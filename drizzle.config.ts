import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: ("./db.sqlite3"),
  },
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations"
});