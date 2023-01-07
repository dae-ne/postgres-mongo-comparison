import express from 'express';
import { exit } from 'process';
import { closeMongoDbConnection, connectToMongoDb } from './domain/mongo/database';
import { router as mongoRouter } from './domain/mongo/routing';
import { connectToPostgresDb } from './domain/postgres/database';
import { router as postgresRouter } from './domain/postgres/routing';
import { router as statsRouter } from './domain/stats/routing.js';
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
const MIN_RECONNECTION_REQUESTS = 2;

const app = express();

let postgresDb: PostgresDb | undefined;
let mongoDb: MongoDb | undefined;
let reconnectionRequests = 0;

export const getApp = () => app;

export const handleEvents = (callback: EventCallbackType, ...events: string[]) => {
  events.forEach((e) => {
    process.on(e, callback);
  });
};

export const connectToDatabases = async (reconnection: DatabaseReconnectionType, attempt = 0) => {
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

export const setUpRouting = () => {
  app.get('/_connect', async (_, res) => {
    reconnectionRequests++;
    logger.info(
      `db connection request: ${reconnectionRequests} (min: ${MIN_RECONNECTION_REQUESTS})`
    );

    if (reconnectionRequests < MIN_RECONNECTION_REQUESTS) {
      res.status(200).json({
        message: 'minimal requests number requirement not satisfied',
        request_number: reconnectionRequests,
        min_requests: MIN_RECONNECTION_REQUESTS
      });
      return;
    }

    const success = await connectToDatabases('retries');

    if (success) {
      logger.info(`connected to databases`);
      res.status(200).json({ message: 'connected' });
      return;
    }

    logger.error('error while connecting to databases');
    res.status(500).json({ message: 'problem with db connection' });
  });

  app.use('/', postgresRouter);
  app.use('/', mongoRouter);
  app.use('/', statsRouter);

  app.get('*', (_, res) => {
    res.status(404).json({ message: '404 - not found' });
  });
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
