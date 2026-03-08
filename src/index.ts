import dotenv from 'dotenv';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config';

dotenv.config();

const app = fastify({ logger: true });

app.register(cors, { origin: true });
// serve public files (PWA stub)
import path from 'path';
import fastifyStatic from '@fastify/static';
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

// JWT support
import jwt from '@fastify/jwt';
app.register(jwt, { secret: config.jwtSecret });

// core routes
import { registerRoutes } from './api';
registerRoutes(app);
app.get('/', async () => {
  return { message: 'SteamPulse API is running' };
});

// start auxiliary services
import { startAnalyzer } from './analyzer/analyzer';
import { startCollector } from './collector/collector';
import { initPush } from './notifier/notifier';

const start = async () => {
  // initialize push system
  initPush();
  // initialize database
  try {
    const { AppDataSource } = await import('./config/database');
    await AppDataSource.initialize();
    app.log.info('Database connected');
  } catch (err) {
    app.log.error({ err }, 'Database connection failed');
    process.exit(1);
  }
  // start background workers, they will listen to queues
  startCollector();
  startAnalyzer();

  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Server listening on ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
