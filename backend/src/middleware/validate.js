import ApiError from "../utils/ApiError.js";

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      return next(new ApiError(400, "Validation failed", result.error.flatten()));
    }

    req.validated = result.data;
    next();
  };
}
