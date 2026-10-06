import grpc from '@grpc/grpc-js';
import { TasksService } from '../proto/index.js';

export function createClient(
  address = process.env.GRPC_ADDRESS || 'localhost:50051'
) {
  return new TasksService(address, grpc.credentials.createInsecure());
}
