import { Express, Request, Response } from 'express';
import { connectToDatabases } from './app.setup';
import { router as mongoRouter } from './domain/mongo/routing';
import { router as postgresRouter } from './domain/postgres/routing';
import { router as statsRouter } from './domain/stats/routing.js';
import { logger } from './library/logging';

const MIN_RECONNECTION_REQUESTS = 2;

let reconnectionRequests = 0;

const handle404 = (_: Request, res: Response) =>
  res.status(404).json({ message: '404 - not found' });

const handleConnectRequest = async (_: Request, res: Response) => {
  reconnectionRequests++;

  logger.info(`db connection request: ${reconnectionRequests} (min: ${MIN_RECONNECTION_REQUESTS})`);

  if (reconnectionRequests < MIN_RECONNECTION_REQUESTS) {
    res.status(200).json({
      message: 'minimal requests number requirement not satisfied',
      request_number: reconnectionRequests,
      min_requests: MIN_RECONNECTION_REQUESTS
    });
    return;
  }

  const connected = await connectToDatabases('retry');

  if (connected) {
    logger.info(`connected to databases`);
    res.status(200).json({ message: 'connected' });
    return;
  }

  logger.error('error while connecting to databases');
  res.status(500).json({ message: 'problem with db connection' });
};

export const setUpRouting = (app: Express) => {
  app.get('/_connect', handleConnectRequest);
  app.use('/', postgresRouter);
  app.use('/', mongoRouter);
  app.use('/', statsRouter);
  app.get('*', handle404);
};
