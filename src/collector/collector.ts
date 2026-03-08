import { createWorker } from '../jobs/queue';
import { collectPrice } from './price';
import { AppDataSource } from '../config/database';
import { Game } from '../models/Game';
import { PriceSnapshot } from '../models/PriceSnapshot';

// simple collector processor that uses Steam API / scraping
export const startCollector = () => {
  const worker = createWorker('collect', async (job: any) => {
    const { appId } = job.data;
    console.log('collecting price for', appId);
    const info = await collectPrice(appId);
    if (info) {
      // find or create game record
      const gameRepo = AppDataSource.getRepository(Game);
      let game = await gameRepo.findOne({ where: { appId } });
      if (!game) {
        game = gameRepo.create({ appId, name: '' });
        await gameRepo.save(game);
      }
      const snapRepo = AppDataSource.getRepository(PriceSnapshot);
      const snapshot = snapRepo.create({
        game,
        priceUsd: info.priceUsd,
        priceBrl: info.priceBrl,
        timestamp: info.timestamp,
      });
      await snapRepo.save(snapshot);

      // enqueue analysis
      const { createQueue } = await import('../jobs/queue');
      const analyzeQueue = createQueue('analyze');
      await analyzeQueue.add('analyze-job', { snapshotId: snapshot.id });
    }
  });

  worker.on('failed', (job, err) => {
    console.error('collector job failed', job.id, err);
  });
};
