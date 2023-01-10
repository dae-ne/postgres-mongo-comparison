import express, { Express } from 'express';
import { exit } from 'process';
import { closeMongoDbConnection, connectToMongoDb } from './domain/mongo/database';
import { connectToPostgresDb } from './domain/postgres/database';
import { logger } from './library/logging';
import { MongoDb, PostgresDb } from './types/database';

type DatabaseReconnectionModeType = 'retry' | 'request';

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

export const connectToDatabases = async (
  reconnectionMode: DatabaseReconnectionModeType,
  attempt = 0
) => {
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

    app.locals = {
      ...app.locals,
      postgresDb,
      mongoDb
    };
    logger.info('successfully connected to databases');

    return true;
  } catch {
    if (reconnectionMode === 'request') {
      logger.warn(`problem with database connection, waiting for api requests to reconnect`);
      return false;
    }

    const a = attempt + 1;

    logger.warn(
      `problem with database connection, retrying in ${DB_CONNECTION_RETRY_DELAY} seconds (attempt: ${a}/${MAX_DB_CONNECTION_RETRY_ATTEMPTS})`
    );

    setTimeout(() => connectToDatabases(reconnectionMode, a), DB_CONNECTION_RETRY_DELAY * 1000);
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
