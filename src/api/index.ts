import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';
import { userRoutes } from './user';
import { gameRoutes } from './game';
import { pushRoutes } from './push';

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }));

  await authRoutes(app);
  await userRoutes(app);
  await gameRoutes(app);
  await pushRoutes(app);
}
