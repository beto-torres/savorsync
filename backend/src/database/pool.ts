import pg from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { config } from "../config.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 5_000,
  connectionTimeoutMillis: 15_000,
});

if (process.env.VERCEL) attachDatabasePool(pool);
