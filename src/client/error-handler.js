import { TaskError } from '../tasks/errors.js';

const statuses = {
  INVALID_ARGUMENT: 400,
  NOT_FOUND: 404,
  UNAVAILABLE: 503,
  DEADLINE_EXCEEDED: 504,
};

export function errorHandler(error, _req, res, _next) {
  const status =
    error.type === 'entity.parse.failed'
      ? 400
      : error.type === 'entity.too.large'
        ? 413
        : error instanceof TaskError
          ? statuses[error.code] || 500
          : 500;
  res.status(status).json({
    message: status === 500 ? 'Internal server error' : error.message,
  });
}
