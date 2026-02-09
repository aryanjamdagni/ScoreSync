import ApiError from "../utils/ApiError.js";

export function simpleRateLimit({ windowMs = 60_000, max = 300 } = {}) {
  const bucket = new Map();

  return (req, _res, next) => {
    const key = req.ip;
    const now = Date.now();

    const entry = bucket.get(key) || { count: 0, start: now };

    if (now - entry.start > windowMs) {
      entry.count = 0;
      entry.start = now;
    }

    entry.count += 1;
    bucket.set(key, entry);

    if (entry.count > max) {
      return next(new ApiError(429, "Too many requests"));
    }

    next();
  };
}
