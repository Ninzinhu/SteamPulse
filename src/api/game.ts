import { FastifyInstance } from 'fastify';
import { findOrCreateGame, addAcquisition, listUserGames } from '../services/gameService';
import { AppDataSource } from '../config/database';
import { PriceSnapshot } from '../models/PriceSnapshot';

export async function gameRoutes(app: FastifyInstance) {
  app.post('/games', { preHandler: [(app as any).authenticate] }, async (req: any, reply) => {
    const { appId, name, cost, date } = req.body;
    if (!appId || !cost || !date) {
      return reply.code(400).send({ error: 'appId, cost and date are required' });
    }
    const user = req.user;
    const game = await findOrCreateGame(appId, name);
    await addAcquisition(user, game, cost, new Date(date));

    // enqueue initial collect job
    const { createQueue } = await import('../jobs/queue');
    const queue = createQueue('collect');
    await queue.add('collect-job', { appId: game.appId });

    return { game };
  });

  app.get('/games', { preHandler: [(app as any).authenticate] }, async (req: any) => {
    return listUserGames(req.user.id);
  });
}
