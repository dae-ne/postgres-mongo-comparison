interface DbConfig {
  user: string;
  password: string;
  database: string;
  host: string;
  port: number;
}

const defaultHost = 'localhost';

const sharedConfig = {
  user: process.env.DB_USER ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? ''
};

export const postgresConfig: DbConfig = {
  ...sharedConfig,
  host: process.env.DB_POSTGRES_HOST ?? defaultHost,
  port: +(process.env.DB_POSTGRES_PORT ?? 5432)
};

export const mongoConfig: DbConfig = {
  ...sharedConfig,
  host: process.env.DB_MONGO_HOST ?? defaultHost,
  port: +(process.env.DB_MONGO_PORT ?? 27017)
};
