import { Queue, QueueScheduler, Worker } from "bullmq";
import IORedis from "ioredis";
import { config } from "../config";

const connection = new IORedis(config.redisUrl);

// export generic function to create queue
export const createQueue = (name: string) => {
  const scheduler = new QueueScheduler(name, { connection });
  return new Queue(name, { connection });
};

export const createWorker = (name: string, processor: any) => {
  return new Worker(name, processor, { connection });
};

export const connectionClient = connection;
