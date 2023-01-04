import { Request } from 'express';
import { PostgresDb } from './db';

export const handlePostgresCountRequest = async (
  req: Request,
  callback: (postgres: PostgresDb) => Promise<void>
) => {
  const { postgresDb } = req.app.locals;
  await callback(postgresDb);
};

export const handlePostgresGetRequest = async (
  req: Request,
  callback: (postgres: PostgresDb, page: number, size: number) => Promise<void>
) => {
  const { postgresDb } = req.app.locals;
  const { page, size } = req.query;
  const pageValue = page ? +page : 0;
  const sizeValue = size ? +size : 30;
  await callback(postgresDb, pageValue, sizeValue);
};
