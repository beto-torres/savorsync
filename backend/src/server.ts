import { app } from "./app.js";
import { config } from "./config.js";
import { pool } from "./database/pool.js";

const server = app.listen(config.PORT, () => {
  console.log(`API disponível em http://localhost:${config.PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
