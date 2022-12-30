import { Pool, PoolConfig } from 'pg';

const postgresConfig: PoolConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'fdc',
  password: 'postgres',
  port: 5432,
};

export const createPostgresDbPool = () => new Pool(postgresConfig);
