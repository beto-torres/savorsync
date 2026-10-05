import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  TZ: z.string().default("America/Sao_Paulo"),
});

export const config = environmentSchema.parse(process.env);
