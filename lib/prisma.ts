/**
 * Server-only Prisma client for Postgres (Neon).
 * Prisma 7 expects a driver adapter here: we use `pg` Pool + `@prisma/adapter-pg`.
 * Used by Route Handlers (e.g. /api/funnels), not from browser code.
 */
import { PrismaPg } from "@prisma/adapter-pg";
// Generated client lives under node_modules/.prisma/client; @prisma/client re-exports it
// via ".prisma/client/default", which TS "bundler" resolution may not follow — import explicitly.
import { PrismaClient } from ".prisma/client/default";
import { Pool } from "pg";

// Reuse one client in dev to survive hot reloads (avoid too many DB connections).
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

// Pool manages multiple connections; Neon/serverless-friendly when using pooled URL.
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
