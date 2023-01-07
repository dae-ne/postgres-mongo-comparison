import { config } from 'dotenv';
import { appConfig } from './config/app';
import {
  cleanup,
  connectToDatabases,
  getApp,
  handleEvents,
  handleUncaughtException,
  setUpRoutes
} from './index.helpers';
import { errorHandlerMiddleware, loggerMiddleware } from './infrastructure/middlewares';
import { logger } from './library/logging';

async function main() {
  const app = getApp();
  const { port } = appConfig;

  config();

  handleEvents(cleanup, 'exit', 'beforeExit', 'SIGINT', 'SIGUSR1', 'SIGUSR2');
  handleEvents(handleUncaughtException, 'uncaughtException');

  await connectToDatabases();

  app.use(loggerMiddleware);
  setUpRoutes();
  app.use(errorHandlerMiddleware);

  app.listen(port, () => {
    logger.info('⚡️ Server is running ⚡️', `http://localhost:${port}`);
  });
}

main();
