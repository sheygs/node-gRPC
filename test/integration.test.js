import assert from 'node:assert/strict';
import { once } from 'node:events';
import { promisify } from 'node:util';
import test from 'node:test';
import grpc from '@grpc/grpc-js';
import { createTaskRepository } from '../src/tasks/repository.js';
import { createTaskService } from '../src/tasks/service.js';
import { createTaskGateway } from '../src/client/gateway.js';
import { createServer } from '../src/server/server.js';
import { createClient } from '../src/client/client.js';
import { createApp } from '../src/client/app.js';

test('HTTP gateway and gRPC task lifecycle', async (t) => {
  const rpcServer = createServer(createTaskService(createTaskRepository()));
  t.after(() => new Promise((resolve) => rpcServer.tryShutdown(resolve)));
  const port = await new Promise((resolve, reject) => {
    rpcServer.bindAsync(
      '127.0.0.1:0',
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) reject(error);
        else resolve(port);
      }
    );
  });
  const client = createClient(`127.0.0.1:${port}`);
  t.after(() => client.close());
  const httpServer = createApp(createTaskGateway(client)).listen(
    0,
    '127.0.0.1'
  );
  t.after(() => new Promise((resolve) => httpServer.close(resolve)));
  await once(httpServer, 'listening');
  const base = `http://127.0.0.1:${httpServer.address().port}`;
  const request = (path, method = 'GET', body) =>
    fetch(`${base}${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const list = await request('/api/v1/tasks');
  assert.deepEqual(await list.json(), { result: [] });
  for (const body of [
    {},
    { title: ' ', body: 'text' },
    { title: 123, body: 'text' },
  ]) {
    assert.equal((await request('/api/v1/tasks', 'POST', body)).status, 400);
  }
  const created = await request('/api/v1/tasks', 'POST', {
    title: 'First',
    body: 'Body',
  });
  assert.equal(created.status, 201);
  const { result: task } = await created.json();
  assert.equal(typeof task.id, 'string');
  const alias = await request('/api/v1/news');
  assert.deepEqual((await alias.json()).result, [task]);
  const edited = await request(`/api/v1/tasks/${task.id}`, 'PUT', {
    title: 'Updated',
    body: 'New body',
  });
  assert.equal(edited.status, 200);
  assert.equal((await edited.json()).result.title, 'Updated');
  assert.equal(
    (
      await request('/api/v1/tasks/missing', 'PUT', {
        title: 'Title',
        body: 'Body',
      })
    ).status,
    404
  );
  assert.equal(
    (await request(`/api/v1/tasks/${task.id}`, 'DELETE')).status,
    204
  );
  assert.equal(
    (await request(`/api/v1/tasks/${task.id}`, 'DELETE')).status,
    404
  );
  assert.deepEqual((await (await request('/api/v1/tasks')).json()).result, []);
  const malformed = await fetch(`${base}/api/v1/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });
  assert.equal(malformed.status, 400);
  await assert.rejects(
    promisify(client.addTasks.bind(client))({ title: '', body: '' }),
    (error) => error.code === grpc.status.INVALID_ARGUMENT
  );
  await new Promise((resolve) => rpcServer.tryShutdown(resolve));
  assert.equal((await request('/api/v1/tasks')).status, 503);
});

test('binding failures reject startup', async () => {
  const { startServer } = await import('../src/server/server.js');
  await assert.rejects(
    startServer(
      createServer(createTaskService(createTaskRepository())),
      'invalid address'
    )
  );
});
