import { config as configEnv } from 'dotenv';
import express, { Response } from 'express';
import { appConfig } from './config/app';
import { closeMongoDbConnection, connectToMongoDb, MongoDb } from './connections/mongo';
import { connectToPostgresDb, PostgresDb } from './connections/postgres';
import { router as mongoRouter } from './routes/mongo';
import { router as postgresRouter } from './routes/postgres';
import { router as statsRouter } from './routes/stats.js';

configEnv();

const runOnEvents = (callback: () => Promise<void>, ...events: string[]) => {
  events.forEach((e) => {
    process.on(e, callback);
  });
};

const main = async () => {
  const app = express();
  const { port } = appConfig;

  app.get('/ping', (_, res: Response) => {
    res.send('Hi!');
  });

  app.use('/', statsRouter);
  app.use('/postgres', postgresRouter);
  app.use('/mongo', mongoRouter);

  let postgresDb: PostgresDb | undefined;
  let mongoDb: MongoDb | undefined;

  const closeConnections = async () => {
    console.log('closing connections');
    postgresDb?.end();
    closeMongoDbConnection();
  };

  runOnEvents(
    closeConnections,
    'cleanup',
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'uncaughtException'
  );

  try {
    postgresDb = connectToPostgresDb();
    mongoDb = await connectToMongoDb();

    app.locals = {
      ...app.locals,
      postgresDb,
      mongoDb
    };

    app.listen(port, () => {
      console.log('⚡️ Server is running: \x1b[34m%s\x1b[0m', `http://localhost:${port}`);
    });
  } catch {
    await closeConnections();
  }
};

main();
