import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "./config/env.js";
import User from "./models/User.js";

let io;

export function initSocket(httpServer) {
  const allowed = env.CORS_ORIGINS.length ? env.CORS_ORIGINS : [env.FRONTEND_URL];

  io = new Server(httpServer, {
    cors: {
      origin: allowed,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      const userId = decoded?.sub;
      if (!userId) return next(new Error("Invalid token"));

      const user = await User.findById(userId).select("_id name email role");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Socket auth failed"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id.toString()}`);
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
