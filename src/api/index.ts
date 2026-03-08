import { FastifyInstance } from 'fastify';

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }));

  // TODO: register auth, user, games, push subscription routes
}
