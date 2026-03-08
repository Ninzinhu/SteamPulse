import { FastifyInstance } from 'fastify';
import { AppDataSource } from '../config/database';
import { PushSubscription } from '../models/PushSubscription';
import { User } from '../models/User';

export async function pushRoutes(app: FastifyInstance) {
  const repo = () => AppDataSource.getRepository(PushSubscription);

  app.get('/push/vapidPublicKey', async (req, reply) => {
    const { vapidPublicKey } = require('../config').config;
    return { publicKey: vapidPublicKey };
  });

  app.post('/push/subscribe', { preHandler: [(app as any).authenticate] }, async (req: any, reply) => {
    const user: User = req.user;
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
      return reply.code(400).send({ error: 'Invalid subscription' });
    }
    const sub = repo().create({ user, endpoint: subscription.endpoint, keys: JSON.stringify(subscription.keys) });
    await repo().save(sub);
    return { success: true };
  });

  app.post('/push/unsubscribe', { preHandler: [(app as any).authenticate] }, async (req: any, reply) => {
    const user: User = req.user;
    const { endpoint } = req.body;
    if (!endpoint) return reply.code(400).send({ error: 'endpoint required' });
    await repo().delete({ user: { id: user.id }, endpoint });
    return { success: true };
  });
}
