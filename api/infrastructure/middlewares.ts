import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logging';

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

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const { message } = err;
  logger.error(message);
  res.status(500).send({ error: message });
};
