import grpc from '@grpc/grpc-js';
import { TaskError } from '../tasks/errors.js';

export function createTaskHandlers(service) {
  const handle =
    (operation) =>
    async ({ request }, callback) => {
      try {
        const result = await operation(request);
        callback(null, result);
      } catch (error) {
        callback({
          code:
            error instanceof TaskError
              ? grpc.status[error.code]
              : grpc.status.INTERNAL,
          details:
            error instanceof TaskError
              ? error.message
              : 'Internal server error',
        });
      }
    };
  return {
    getAllTasks: handle(async () => ({ tasks: await service.list() })),
    addTasks: handle((request) => service.add(request)),
    editTasks: handle((request) => service.edit(request)),
    deleteTasks: handle(async ({ id }) => {
      await service.delete(id);
      return {};
    }),
  };
}
