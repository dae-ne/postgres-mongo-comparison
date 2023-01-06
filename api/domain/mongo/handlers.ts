import { Request } from 'express';
import { MongoDb } from './db';
import { getPaginationQueryStringParams } from '../../utils/query-strings';

export const handleMongoCountRequest = async (
  req: Request,
  callback: (mongo: MongoDb) => Promise<void>
) => {
  const { mongoDb } = req.app.locals;
  await callback(mongoDb);
};

export const handleMongoGetRequest = async (
  req: Request,
  callback: (mongo: MongoDb, page: number, size: number) => Promise<void>
) => {
  const { mongoDb } = req.app.locals;
  const { page, size } = getPaginationQueryStringParams(req.query);
  await callback(mongoDb, page, size);
};

export const handleMongoGetByIdRequest = async (
  req: Request,
  callback: (postgres: MongoDb, page: number, size: number, id: number) => Promise<void>
) => {
  const { id } = req.params;
  const { mongoDb } = req.app.locals;
  const defaultQueryParam = 1;
  await callback(mongoDb, defaultQueryParam, defaultQueryParam, +id);
};
