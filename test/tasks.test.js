import assert from 'node:assert/strict';
import test from 'node:test';
import grpc from '@grpc/grpc-js';
import { createTaskRepository } from '../src/tasks/repository.js';
import { createTaskService } from '../src/tasks/service.js';
import { TaskError } from '../src/tasks/errors.js';
import { createTaskHandlers } from '../src/server/handlers.js';

test('repository protects stored tasks from mutation', () => {
  const seed = { id: '1', title: 'Title', body: 'Body' };
  const repository = createTaskRepository([seed]);
  seed.title = 'Changed';
  repository.find('1').title = 'Changed';
  repository.list()[0].body = 'Changed';
  const task = { id: '2', title: 'Second', body: 'Body' };
  const saved = repository.save(task);
  task.title = 'Changed';
  saved.body = 'Changed';
  assert.deepEqual(repository.list(), [
    { id: '1', title: 'Title', body: 'Body' },
    { id: '2', title: 'Second', body: 'Body' },
  ]);
});

test('task service enforces rules without a transport', () => {
  const service = createTaskService(
    createTaskRepository(),
    () => 'generated-id'
  );
  assert.throws(
    () => service.add({ title: 123, body: 'Body' }),
    (error) => error instanceof TaskError && error.code === 'INVALID_ARGUMENT'
  );
  const task = service.add({ title: 'Title', body: 'Body', extra: 'ignored' });
  assert.deepEqual(task, { id: 'generated-id', title: 'Title', body: 'Body' });
  assert.throws(
    () => service.edit({ id: task.id, title: '', body: 'Body' }),
    (error) => error.code === 'INVALID_ARGUMENT'
  );
  assert.deepEqual(service.list(), [task]);
  service.delete(task.id);
  assert.throws(
    () => service.delete(task.id),
    (error) => error.code === 'NOT_FOUND'
  );
});

test('gRPC adapter hides unexpected service failures', async () => {
  const handlers = createTaskHandlers({
    async add() {
      throw new Error('private database details');
    },
  });
  const error = await new Promise((resolve) =>
    handlers.addTasks({ request: {} }, resolve)
  );
  assert.deepEqual(error, {
    code: grpc.status.INTERNAL,
    details: 'Internal server error',
  });
});
