import { Pool, PoolConfig } from 'pg';
import { postgresConfig } from '../../config/db';

export type PostgresDb = Pool;

const config: PoolConfig = postgresConfig;

export const connectToPostgresDb = () => new Pool(config);
