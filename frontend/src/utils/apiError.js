export function normalizeApiError(err) {
  const fallback = "Something went wrong. Please try again.";
  if (!err) return { message: fallback, status: 0 };

  const status = err?.response?.status || 0;
  const message =
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.message ||
    fallback;

  return { message, status };
}
