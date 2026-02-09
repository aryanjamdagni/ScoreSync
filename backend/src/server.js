import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket.js";

async function start() {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`✅ API running on http://localhost:${env.PORT}`);
  });

  server.on("error", (err) => {
    console.error(" Server error", err);
    process.exit(1);
  });

  const shutdown = (signal) => {
    try {
      console.log(`\n${signal} received. Shutting down...`);
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    } catch (e) {
      console.error("Shutdown error", e);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});
