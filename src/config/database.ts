import { DataSource } from 'typeorm';
import { config } from './index';

// Support either postgres (via DATABASE_URL) or fallback to sqlite
let dataSourceConfig: any;
if (config.databaseUrl && config.databaseUrl.startsWith('postgres')) {
  dataSourceConfig = {
    type: 'postgres',
    url: config.databaseUrl,
  };
} else {
  dataSourceConfig = {
    type: 'sqlite',
    database: 'dev.sqlite',
  };
}

export const AppDataSource = new DataSource({
  ...dataSourceConfig,
  synchronize: true, // WARNING: auto-sync for dev only
  logging: false,
  entities: [__dirname + '/../models/*.ts'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  subscribers: [],
});
