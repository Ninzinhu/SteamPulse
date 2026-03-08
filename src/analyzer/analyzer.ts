import { createWorker } from '../jobs/queue';
import { AppDataSource } from '../config/database';
import { PriceSnapshot } from '../models/PriceSnapshot';
import { Acquisition } from '../models/Acquisition';
import { Alert } from '../models/Alert';
import { sendPush } from '../notifier/notifier';
import { PushSubscription } from '../models/PushSubscription';

export const startAnalyzer = () => {
  const worker = createWorker('analyze', async (job: any) => {
    const { snapshotId } = job.data;
    console.log('analyzing snapshot', snapshotId);
    const snapshotRepo = AppDataSource.getRepository(PriceSnapshot);
    const snap = await snapshotRepo.findOne({ where: { id: snapshotId }, relations: ['game'] });
    if (!snap) return;

    // find acquisitions for this game
    const acqRepo = AppDataSource.getRepository(Acquisition);
    const acqs = await acqRepo.find({ where: { game: { id: snap.game.id } }, relations: ['user'] });

    for (const acq of acqs) {
      if (snap.priceUsd < acq.cost) {
        // create alert if not already created for this snapshot/user
        const alertRepo = AppDataSource.getRepository(Alert);
        const existing = await alertRepo.findOne({
          where: { user: { id: acq.user.id }, snapshot: { id: snap.id } },
        });
        if (!existing) {
          const alert = alertRepo.create({ user: acq.user, game: snap.game, snapshot: snap });
          await alertRepo.save(alert);

          // send notifications
          const subRepo = AppDataSource.getRepository(PushSubscription);
          const subs = await subRepo.find({ where: { user: { id: acq.user.id } } });
          for (const sub of subs) {
            try {
              const subscription = {
                endpoint: sub.endpoint,
                keys: JSON.parse(sub.keys),
              };
              await sendPush(subscription, {
                title: 'SteamPulse Alert',
                body: `Price dropped for ${snap.game.appId}: $${snap.priceUsd} < your cost $${acq.cost}`,
                data: { appId: snap.game.appId },
              });
            } catch (err) {
              console.error('push fail', err);
            }
          }
        }
      }
    }
  });

  worker.on('failed', (job, err) => {
    console.error('analyzer job failed', job.id, err);
  });
};
