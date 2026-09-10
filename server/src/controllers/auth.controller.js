import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';
import { asyncHandler, ok } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await user.verifyPassword(password))) {
    throw ApiError.unauthorized('That email or password doesn’t match our records.');
  }
  const token = signToken(user);
  res.cookie('token', token, cookieOptions);
  ok(res, { user: user.toPublic(), token });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  ok(res, req.user.toPublic());
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: 0 });
  ok(res, { ok: true });
});
