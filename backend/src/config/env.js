import dotenv from "dotenv";
dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v || String(v).trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function optional(name, fallback = undefined) {
  const v = process.env[name];
  if (!v || String(v).trim() === "") return fallback;
  return v;
}

function parseOrigins(raw) {
  const s = String(raw || "").trim();
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export const env = {
  NODE_ENV: optional("NODE_ENV", "development"),
  PORT: Number(optional("PORT", 5000)),

  MONGO_URI: required("MONGO_URI"),

  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_ACCESS_EXPIRES: optional("JWT_ACCESS_EXPIRES", "7d"),

  FRONTEND_URL: optional("FRONTEND_URL", "http://localhost:5173"),
  CORS_ORIGINS: parseOrigins(optional("CORS_ORIGINS", "http://localhost:5173")),
};
