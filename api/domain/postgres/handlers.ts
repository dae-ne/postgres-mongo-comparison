import { Request } from 'express';
import { PostgresDb } from '../../types/database';
import { getPaginationQueryStringParams } from '../../utils/query-strings';

export const handlePostgresCountRequest = async (
  req: Request,
  callback: (db: PostgresDb) => Promise<void>
) => {
  const { postgresDb } = req.app.locals;
  await callback(postgresDb);
};

export const handlePostgresGetRequest = async (
  req: Request,
  callback: (db: PostgresDb, page: number, size: number) => Promise<void>
) => {
  const { postgresDb } = req.app.locals;
  const { page, size } = getPaginationQueryStringParams(req.query);
  await callback(postgresDb, page, size);
};

export const handlePostgresGetByIdRequest = async (
  req: Request,
  callback: (db: PostgresDb, page: number, size: number, id: number) => Promise<void>
) => {
  const { id } = req.params;
  const { postgresDb } = req.app.locals;
  const defaultQueryParam = 1;
  await callback(postgresDb, defaultQueryParam, defaultQueryParam, +id);
};
