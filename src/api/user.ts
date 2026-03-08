import { FastifyInstance } from 'fastify';
import { getUserById } from '../services/userService';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/me', { preHandler: [(app as any).authenticate] }, async (req: any, reply) => {
    const userId = req.user.id;
    const user = await getUserById(userId);
    if (!user) return reply.code(404).send({ error: 'User not found' });
    return user;
  });
}
