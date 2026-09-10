import { User } from '../models/User.js';
import { verifyToken } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function extractToken(req) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  if (req.cookies?.token) return req.cookies.token;
  return null;
}

/** Populates req.user when a valid token is present; otherwise continues anonymously. */
export const attachUser = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
  } catch {
    /* invalid / expired token → anonymous */
  }
  next();
});

export const requireAuth = (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized('Please sign in.'));
  next();
};

export const requireAdmin = (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (req.user.role !== 'admin') return next(ApiError.forbidden('Admin access only.'));
  next();
};
