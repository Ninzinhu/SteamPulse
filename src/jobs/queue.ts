import { Queue, Worker } from 'bullmq';
import { config } from "../config";

// if redis url not available, provide in-memory stub objects
let connection: any;
try {
  if (config.redisUrl) {
    const IORedis = require('ioredis');
    connection = new IORedis(config.redisUrl);
  }
} catch (err) {
  console.warn('Redis unavailable, falling back to stub queues');
}

// export generic function to create queue
export const createQueue = (name: string) => {
  if (!connection) {
    return {
      add: async () => {},
    };
  }
  return new Queue(name, { connection });
};

export const createWorker = (name: string, processor: any) => {
  if (!connection) {
    // simple in-process poller (not implemented)
    console.warn('worker stub for', name);
    return {
      on: () => {},
    };
  }
  return new Worker(name, processor, { connection });
};

export const connectionClient = connection;
