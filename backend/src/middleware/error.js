import ApiError from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, _req, res, _next) {
  const isCors =
    typeof err?.message === "string" && err.message.startsWith("CORS blocked");

  const status = err.statusCode || (isCors ? 403 : 500);
  const message = err.message || "Server error";
  const details = err.details || null;

  if (status >= 500) console.error(err);

  res.status(status).json({
    success: false,
    message,
    details,
  });
}
