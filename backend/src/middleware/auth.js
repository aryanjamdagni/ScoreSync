import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

export function requireAuth(roles = null) {
  return async (req, _res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next(new ApiError(401, "Unauthorized"));

    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
      const user = await User.findById(payload.sub).select("-passwordHash");
      if (!user) return next(new ApiError(401, "Unauthorized"));

      if (roles && Array.isArray(roles)) {
        const allowed = roles.map((r) => String(r).trim().toUpperCase());
        const actual = String(user.role || "").trim().toUpperCase();
        if (!allowed.includes(actual)) {
          return next(new ApiError(403, "Forbidden"));
        }
      }

      req.user = user;
      next();
    } catch {
      next(new ApiError(401, "Invalid token"));
    }
  };
}
