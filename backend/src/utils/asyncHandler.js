import ApiError from "./ApiError.js";

export const asyncHandler = (fn) => {
  if (typeof fn !== "function") {
    return (_req, _res, next) =>
      next(new ApiError(500, "Internal error: route handler is not a function"));
  }

  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
