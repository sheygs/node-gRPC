import { createTaskRepository } from '../tasks/repository.js';
import { createTaskService } from '../tasks/service.js';
import initialTasks from './tasks.js';
import { createServer, startServer } from './server.js';

const address = process.env.GRPC_ADDRESS || 'localhost:50051';
const service = createTaskService(createTaskRepository(initialTasks));
try {
  const server = await startServer(createServer(service), address);
  console.log(`gRPC server listening at ${address}`);

  const shutdown = () =>
    server.tryShutdown((error) => {
      if (error) {
        console.error(error);
        process.exitCode = 1;
      }
    });

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
