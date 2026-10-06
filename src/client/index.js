import { createClient } from './client.js';
import { createTaskGateway } from './gateway.js';
import { createApp } from './app.js';

const client = createClient();
const port = process.env.PORT || 3000;
const server = createApp(createTaskGateway(client)).listen(port, () => {
  console.log(`HTTP server listening on port ${port}`);
});

server.on('error', (error) => {
  console.error(error);
  client.close();
  process.exitCode = 1;
});

const shutdown = () => server.close(() => client.close());
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
