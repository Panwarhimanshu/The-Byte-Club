import { ApiError } from '../utils/ApiError.js';

/** validate({ body, query, params }) with zod schemas. Replaces req[key] with parsed data. */
export const validate = (schemas) => (req, _res, next) => {
  try {
    for (const key of ['body', 'params', 'query']) {
      if (!schemas[key]) continue;
      const result = schemas[key].safeParse(req[key]);
      if (!result.success) {
        return next(
          ApiError.badRequest(
            'Some fields need attention.',
            result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
          ),
        );
      }
      if (key !== 'query') req[key] = result.data;
    }
    next();
  } catch (err) {
    next(err);
  }
};
