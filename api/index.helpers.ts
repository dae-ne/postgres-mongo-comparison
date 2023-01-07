import { Express } from 'express';
import { router as mongoRouter } from './domain/mongo/routing';
import { router as postgresRouter } from './domain/postgres/routing';
import { router as statsRouter } from './domain/stats/routing.js';

type EventCallbackType = (() => Promise<void>) | ((error: Error) => Promise<void>);

export const handleEvents = (callback: EventCallbackType, ...events: string[]) => {
  events.forEach((e) => {
    process.on(e, callback);
  });
};

export const setUpRoutes = (app: Express) => {
  app.get('/_health', (_, res) => {
    res.send('ok');
  });

  app.use('/', postgresRouter);
  app.use('/', mongoRouter);
  app.use('/', statsRouter);

  app.get('*', (_, res) => {
    res.status(404).json({ message: '404 - not found' });
  });
};
