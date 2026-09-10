import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let code = err.code;
  let details = err.details;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    code = 'validation_error';
    message = 'Some fields need attention.';
    details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
  } else if (err.code === 11000) {
    statusCode = 409;
    code = 'duplicate';
    message = `That ${Object.keys(err.keyValue || { value: '' })[0]} is already in use.`;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'invalid_token';
    message = 'Your session has expired. Please sign in again.';
  }

  if (statusCode >= 500) {
    console.error('✖', err);
  }

  res.status(statusCode).json({
    error: {
      message: statusCode >= 500 && env.isProd ? 'Internal server error' : message,
      code,
      ...(details ? { details } : {}),
      ...(env.isProd ? {} : { stack: err.stack?.split('\n').slice(0, 4) }),
    },
  });
};
