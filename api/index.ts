import { config } from 'dotenv';
import express from 'express';
import { exit } from 'process';
import { appConfig } from './config/app';
import { closeMongoDbConnection, connectToMongoDb } from './domain/mongo/database';
import { connectToPostgresDb } from './domain/postgres/database';
import { handleEvents, setUpRoutes } from './index.helpers';
import { errorHandlerMiddleware, loggerMiddleware } from './infrastructure/middlewares';
import { MongoDb, PostgresDb } from './types/database';
import { logger } from './utils/logging';

config();

async function main() {
  const app = express();
  const { port } = appConfig;

  let postgresDb: PostgresDb | undefined;
  let mongoDb: MongoDb | undefined;

  const connectToDatabases = async () => {
    try {
      logger.info('connecting to databases');
      postgresDb = connectToPostgresDb();
      mongoDb = await connectToMongoDb();
      logger.info('successfully connected to databases');
    } catch {
      logger.error('error while connecting to databases');
      exit(1);
    }
  };

  const cleanup = async () => {
    logger.info('app cleanup');
    postgresDb?.end();
    closeMongoDbConnection();
    logger.info('closing app');
  };

  const handleUncaughtException = (error: Error) => {
    logger.error(error.message);
    exit(1);
  };

  handleEvents(cleanup, 'exit', 'beforeExit', 'SIGINT', 'SIGUSR1', 'SIGUSR2');
  handleEvents(handleUncaughtException, 'uncaughtException');

  await connectToDatabases();

  app.use(loggerMiddleware);

  setUpRoutes(app);

  app.use(errorHandlerMiddleware);

  app.locals = {
    ...app.locals,
    postgresDb,
    mongoDb
  };

  app.listen(port, () => {
    logger.info('⚡️ Server is running ⚡️', `http://localhost:${port}`);
  });
}

main();
