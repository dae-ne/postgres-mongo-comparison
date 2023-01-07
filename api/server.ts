/* eslint-disable import/first */
// eslint-disable-next-line import/order
import { config as configEnvVariables } from 'dotenv';

configEnvVariables();

import { appConfig } from './config/app';
import { errorHandlerMiddleware, loggerMiddleware } from './infrastructure/middlewares';
import { logger } from './library/logging';
import { setUpRouting } from './server.routing';
import {
  cleanup,
  connectToDatabases,
  createExpressApp,
  handleEvents,
  handleUncaughtException
} from './server.setup';

async function main() {
  const app = createExpressApp();
  const { port } = appConfig;

  handleEvents(cleanup, 'exit', 'beforeExit', 'SIGINT', 'SIGUSR1', 'SIGUSR2');
  handleEvents(handleUncaughtException, 'uncaughtException');

  await connectToDatabases('api');

  app.use(loggerMiddleware);
  setUpRouting(app);
  app.use(errorHandlerMiddleware);

  app.listen(port, () => {
    logger.info('⚡️ Server is running ⚡️', `http://localhost:${port}`);
  });
}

main();
