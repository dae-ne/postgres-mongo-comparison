import { config } from 'dotenv';
import { appConfig } from './config/app';
import { errorHandlerMiddleware, loggerMiddleware } from './infrastructure/middlewares';
import { logger } from './library/logging';
import {
  cleanup,
  connectToDatabases,
  getApp,
  handleEvents,
  handleUncaughtException,
  setUpRoutes
} from './server.setup';

async function main() {
  const app = getApp();
  const { port } = appConfig;

  config();

  handleEvents(cleanup, 'exit', 'beforeExit', 'SIGINT', 'SIGUSR1', 'SIGUSR2');
  handleEvents(handleUncaughtException, 'uncaughtException');

  await connectToDatabases('api');

  app.use(loggerMiddleware);
  setUpRoutes();
  app.use(errorHandlerMiddleware);

  app.listen(port, () => {
    logger.info('⚡️ Server is running ⚡️', `http://localhost:${port}`);
  });
}

main();
