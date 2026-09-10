/** Wraps an async route handler so rejected promises reach the error middleware. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** Standard success envelope. */
export const ok = (res, data, status = 200, meta) =>
  res.status(status).json({ data, ...(meta ? { meta } : {}) });
