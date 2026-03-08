import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export const findOrCreateUser = async (steamId: string, email?: string) => {
  const repo = AppDataSource.getRepository(User);
  let user = await repo.findOne({ where: { steamId } });
  if (!user) {
    user = repo.create({ steamId, email });
    await repo.save(user);
  } else if (email && email !== user.email) {
    user.email = email;
    await repo.save(user);
  }
  return user;
};

export const getUserById = async (id: number) => {
  const repo = AppDataSource.getRepository(User);
  return repo.findOne({ where: { id } });
};
