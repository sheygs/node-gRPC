import { Router } from 'express';
import { validateTask } from '../tasks/errors.js';

export function createTaskRouter(tasks) {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json({ result: await tasks.list() });
  });

  router.post('/', async (req, res) => {
    const result = await tasks.add(validateTask(req.body));
    res.status(201).json({ result, message: 'successful' });
  });

  router.put('/:id', async (req, res) => {
    const result = await tasks.edit({
      id: req.params.id,
      ...validateTask(req.body),
    });

    res.json({ result });
  });

  router.delete('/:id', async (req, res) => {
    await tasks.delete(req.params.id);
    res.sendStatus(204);
  });

  return router;
}
