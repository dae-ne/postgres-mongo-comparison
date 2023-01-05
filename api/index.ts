import { config } from 'dotenv';
import express, { Express } from 'express';
import { exit } from 'process';
import { appConfig } from './config/app';
import { closeMongoDbConnection, connectToMongoDb, MongoDb } from './domain/mongo/db';
import { router as mongoRouter } from './domain/mongo/routing';
import { connectToPostgresDb, PostgresDb } from './domain/postgres/db';
import { router as postgresRouter } from './domain/postgres/routing';
import { router as statsRouter } from './domain/stats/routing.js';
import { errorHandlerMiddleware, loggerMiddleware } from './infrastructure/middlewares';
import { logger } from './utils/logging';

config();

type EventCallbackType = (() => Promise<void>) | ((error: Error) => Promise<void>);

const handleEvents = (callback: EventCallbackType, ...events: string[]) => {
  events.forEach((e) => {
    process.on(e, callback);
  });
};

const setUpRoutes = (app: Express) => {
  app.get('/_health', (_, res) => {
    res.send('ok');
  });

  app.use('/', postgresRouter);
  app.use('/', mongoRouter);
  app.use('/', statsRouter);

  // app.get('/', (_, res) => {
  //   let endpoints: string[] = [];
  //   const routers = [statsRouter, postgresRouter, mongoRouter];
  //   routers.forEach((router) => {
  //     endpoints = [...endpoints, ...router.stack.map((r) => r.route.path)];
  //   });
  //   res.send(endpoints);
  // });

  app.get('*', (_, res) => {
    res.status(404).send({ message: '404 - not found' });
  });
};

const main = async () => {
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
};

main();
