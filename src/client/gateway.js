import { promisify } from 'node:util';
import grpc from '@grpc/grpc-js';
import { TaskError } from '../tasks/errors.js';

const codes = new Map([
  [grpc.status.INVALID_ARGUMENT, 'INVALID_ARGUMENT'],
  [grpc.status.NOT_FOUND, 'NOT_FOUND'],
  [grpc.status.UNAVAILABLE, 'UNAVAILABLE'],
  [grpc.status.DEADLINE_EXCEEDED, 'DEADLINE_EXCEEDED'],
]);

export function createTaskGateway(client, timeoutMs = 5000) {
  const invoke = async (method, request) => {
    try {
      return await promisify(client[method].bind(client))(request, {
        deadline: Date.now() + timeoutMs,
      });

    } catch (error) {
      const code = codes.get(error.code);

      if (code) throw new TaskError(code, error.details || error.message);
      
      throw error;
    }
  };
  return {
    async list() {
      return (await invoke('getAllTasks', {})).tasks;
    },
    add: (input) => invoke('addTasks', input),
    edit: (input) => invoke('editTasks', input),
    delete: (id) => invoke('deleteTasks', { id }),
  };
}
