import { fileURLToPath } from 'node:url';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const definition = protoLoader.loadSync(
  fileURLToPath(new URL('./tasks.proto', import.meta.url)),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);

export const TasksService = grpc.loadPackageDefinition(definition).TasksService;
