import { config } from 'dotenv';
import express, { Express, Response } from 'express';
import { exit } from 'process';
import { appConfig } from './config/app';
import { closeMongoDbConnection, connectToMongoDb, MongoDb } from './domain/mongo/db';
import { router as mongoRouter } from './domain/mongo/routing';
import { connectToPostgresDb, PostgresDb } from './domain/postgres/db';
import { router as postgresRouter } from './domain/postgres/routing';
import { router as statsRouter } from './domain/stats/routing.js';
import { logger } from './infrastructure/logging';
import { loggerMiddleware } from './infrastructure/middleware';

config();

const handleEvents = (callback: () => Promise<void>, ...events: string[]) => {
  events.forEach((e) => {
    process.on(e, callback);
  });
};

const setUpRoutes = (app: Express) => {
  app.get('/_health', (_, res: Response) => {
    res.send('ok');
  });

  app.use('/', statsRouter);
  app.use('/', postgresRouter);
  app.use('/', mongoRouter);

  app.get('/', (_, res: Response) => {
    let endpoints: string[] = [];
    const routers = [statsRouter, postgresRouter, mongoRouter];
    routers.forEach((router) => {
      endpoints = [...endpoints, ...router.stack.map((r) => r.route.path)];
    });
    res.status(200).send(endpoints);
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

  const handleUncaughtException = () => {
    logger.error('error occourred, closing app');
    exit(1);
  };

  handleEvents(cleanup, 'exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2');
  handleEvents(handleUncaughtException, 'uncaughtException');

  await connectToDatabases();

  app.use(loggerMiddleware);

  setUpRoutes(app);

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
