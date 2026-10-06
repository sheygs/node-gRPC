export class TaskError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TaskError';
    this.code = code;
  }
}

export function validateTask({ title, body } = {}) {
  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof body !== 'string' ||
    !body.trim()
  ) {
    throw new TaskError('INVALID_ARGUMENT', 'Title and body are required');
  }
  return { title, body };
}
