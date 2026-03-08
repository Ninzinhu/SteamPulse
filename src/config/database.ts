import { DataSource } from "typeorm";
import { config } from "./index";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: config.databaseUrl,
  synchronize: false,
  logging: false,
  entities: [__dirname + "/../models/*.ts"],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  subscribers: [],
});
