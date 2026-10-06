import { randomUUID } from 'node:crypto';
import { TaskError, validateTask } from './errors.js';

export function createTaskService(repository, generateId = randomUUID) {
  return {
    list: () => repository.list(),

    add(input) {
      return repository.save({ ...validateTask(input), id: generateId() });
    },

    edit({ id, ...input }) {
      if (!repository.find(id)) {
        throw new TaskError('NOT_FOUND', 'Task does not exist');
      }
      return repository.save({ id, ...validateTask(input) });
    },

    delete(id) {
      if (!repository.delete(id)) {
        throw new TaskError('NOT_FOUND', 'Task does not exist');
      }
    },
  };
}
