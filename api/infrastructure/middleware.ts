import { Request, Response, NextFunction } from 'express';
import { logger } from './logging';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  logger.info(`${method} ${url} [STARTED]`);
  const start = Date.now();

  res.on('finish', () => {
    const elapsed = Date.now() - start;
    logger.info(`${method} ${url} [FINISHED] (time: ${elapsed} ms)`);
  });

  next();
};
