import { Request } from 'express';
import { MongoDb } from './db';

export const handleMongoRequest = async (
  req: Request,
  callback: (mongo: MongoDb) => Promise<void>
) => {
  const { mongoDb } = req.app.locals;
  await callback(mongoDb);
};
