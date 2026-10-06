import grpc from '@grpc/grpc-js';
import { TasksService } from '../proto/index.js';
import { createTaskHandlers } from './handlers.js';

export function createServer(service) {
  const server = new grpc.Server();
  server.addService(TasksService.service, createTaskHandlers(service));
  return server;
}

export async function startServer(server, address) {
  await new Promise((resolve, reject) => {
    server.bindAsync(
      address,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) reject(error);
        else resolve(port);
      }
    );
  });
  return server;
}
