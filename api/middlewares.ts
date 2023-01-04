import { Request, Response, NextFunction } from 'express';
import { logger } from './library/logging';

export const loggerMiddleware = (req: Request, _: Response, next: NextFunction) => {
  const { method, url } = req;
  const message = `request: ${method} ${url}`;
  logger.info(message);
  next();
};
