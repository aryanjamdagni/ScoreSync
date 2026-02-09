import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { simpleRateLimit } from "./middleware/rateLimit.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import storeRoutes from "./routes/store.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(simpleRateLimit({ windowMs: 60_000, max: 300 }));

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);

    const allowed = env.CORS_ORIGINS.length ? env.CORS_ORIGINS : [env.FRONTEND_URL];
    if (allowed.includes(origin)) return cb(null, true);

    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => res.json({ success: true, name: "ScoreSync API" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

