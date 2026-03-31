// Prisma CLI config (migrate, generate). Loads DATABASE_URL for schema/migrations.
// Runtime server code also uses DATABASE_URL via lib/prisma.ts + this same env var.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
