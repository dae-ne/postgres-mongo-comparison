import { Pool, PoolConfig } from 'pg';
import { postgresConfig } from '../../config/database';
import { PostgresDb } from '../../types/database';

const config: PoolConfig = postgresConfig;

export const connectToPostgresDb = (): PostgresDb => new Pool(config);
