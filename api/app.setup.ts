import express, { Express } from 'express';
import { exit } from 'process';
import { closeMongoDbConnection, connectToMongoDb } from './domain/mongo/database';
import { connectToPostgresDb } from './domain/postgres/database';
import { logger } from './library/logging';
import { MongoDb, PostgresDb } from './types/database';

type DatabaseReconnectionType = 'retries' | 'api';

type EventCallbackType =
  | (() => void)
  | ((error: Error) => void)
  | (() => Promise<void>)
  | ((error: Error) => Promise<void>);

const DB_CONNECTION_RETRY_DELAY = 5;
const MAX_DB_CONNECTION_RETRY_ATTEMPTS = 3;

let app: Express | undefined;
let postgresDb: PostgresDb | undefined;
let mongoDb: MongoDb | undefined;

export const createExpressApp = () => {
  app = express();
  return app;
};

export const handleEvents = (callback: EventCallbackType, ...events: string[]) => {
  events.forEach((e) => {
    process.on(e, callback);
  });
};

export const connectToDatabases = async (reconnection: DatabaseReconnectionType, attempt = 0) => {
  if (!app) {
    logger.error('express app was not created yet');
    return false;
  }

  if (attempt >= MAX_DB_CONNECTION_RETRY_ATTEMPTS) {
    logger.error('database connection failed, closing app');
    exit(1);
  }

  try {
    logger.info('connecting to databases');
    postgresDb = connectToPostgresDb();
    mongoDb = await connectToMongoDb();
    logger.info('successfully connected to databases');

    app.locals = {
      ...app.locals,
      postgresDb,
      mongoDb
    };

    return true;
  } catch {
    if (reconnection === 'api') {
      logger.warn(`problem with database connection, waiting for api requests to reconnect`);
      return false;
    }

    const a = attempt + 1;

    logger.warn(
      `problem with database connection, retrying in ${DB_CONNECTION_RETRY_DELAY} seconds (attempt: ${a}/${MAX_DB_CONNECTION_RETRY_ATTEMPTS})`
    );

    setTimeout(() => connectToDatabases(reconnection, a), DB_CONNECTION_RETRY_DELAY * 1000);
    return false;
  }
};

export const cleanup = async () => {
  logger.info('app cleanup');
  postgresDb?.end();
  closeMongoDbConnection();
  logger.info('closing app');
};

export const handleUncaughtException = (error: Error) => {
  logger.error(error.message);
};
