import { AppDataSource } from '../config/database';
import { Game } from '../models/Game';
import { Acquisition } from '../models/Acquisition';
import { User } from '../models/User';

export const findOrCreateGame = async (appId: number, name?: string) => {
  const repo = AppDataSource.getRepository(Game);
  let game = await repo.findOne({ where: { appId } });
  if (!game) {
    game = repo.create({ appId, name: name || '' });
    await repo.save(game);
  }
  return game;
};

export const addAcquisition = async (user: User, game: Game, cost: number, date: Date) => {
  const repo = AppDataSource.getRepository(Acquisition);
  const acq = repo.create({ user, game, cost, date });
  return repo.save(acq);
};

export const listUserGames = async (userId: number) => {
  const repo = AppDataSource.getRepository(Acquisition);
  return repo.find({ where: { user: { id: userId } }, relations: ['game'] });
};
