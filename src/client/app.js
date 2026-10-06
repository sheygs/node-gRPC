import express from 'express';
import cors from 'cors';
import { createTaskRouter } from './routes.js';
import { errorHandler } from './error-handler.js';

export function createApp(tasks) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(['/api/v1/tasks', '/api/v1/news'], createTaskRouter(tasks));
  app.use(errorHandler);
  return app;
}
