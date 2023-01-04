import { Request, Response, NextFunction } from 'express';
import { logger } from './library/logging';

export const loggerMiddleware = (req: Request, _: Response, next: NextFunction) => {
  const { method, url } = req;
  logger.info(`request: ${method} ${url}`);
  const start = Date.now();
  next();
  const elapsed = Date.now() - start;
  logger.info(`done: ${method} ${url} (time: ${elapsed} ms)`);
};
