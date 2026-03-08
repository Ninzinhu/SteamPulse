import { FastifyInstance } from 'fastify';
import { config } from '../config';
import { SteamAuth } from 'steam-openid-client';
import { findOrCreateUser } from '../services/userService';

export async function authRoutes(app: FastifyInstance) {
  // provide middleware to protect routes
  app.decorate('authenticate', async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  const steam = new SteamAuth(
    config.steamReturnUrl.replace(/\/auth\/steam\/return$/, ''),
    config.steamReturnUrl,
    config.steamApiKey
  );

  app.get('/auth/steam', async (req, reply) => {
    const redirectUrl = await steam.getDirectUrl();
    if (redirectUrl) {
      reply.redirect(redirectUrl);
    } else {
      reply.code(500).send({ error: 'Unable to obtain Steam login URL' });
    }
  });

  app.get('/auth/steam/return', async (req, reply) => {
    try {
      const url = new URL(req.raw.url!, `http://${req.headers.host}`);
      const userInfo = await steam.authenticate(url);
      if (!userInfo) {
        return reply.code(500).send({ error: 'Steam authentication returned no user' });
      }
      // create user in DB
      const email = (userInfo._json as any)?.email as string | undefined;
      const user = await findOrCreateUser(userInfo.steamid, email);
      const token = app.jwt.sign({ id: user.id, steamId: user.steamId });
      reply.send({ token, user });
    } catch (err) {
      app.log.error(err);
      reply.code(500).send({ error: 'Steam authentication failed' });
    }
  });
}
