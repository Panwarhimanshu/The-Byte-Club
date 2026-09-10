export class ApiError extends Error {
  constructor(statusCode, message, code, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }

  static badRequest(msg = 'Bad request', details) {
    return new ApiError(400, msg, 'bad_request', details);
  }
  static unauthorized(msg = 'Not authenticated') {
    return new ApiError(401, msg, 'unauthorized');
  }
  static forbidden(msg = 'Not allowed') {
    return new ApiError(403, msg, 'forbidden');
  }
  static notFound(msg = 'Not found') {
    return new ApiError(404, msg, 'not_found');
  }
  static conflict(msg = 'Conflict') {
    return new ApiError(409, msg, 'conflict');
  }
}
