import { Request } from 'express';
import { getPaginationQueryStringParams } from '../../library/query-strings';

export const handleCountRequest = async <TDb>(
  getDb: () => TDb,
  callback: (db: TDb) => Promise<void>
) => {
  const db = getDb();
  await callback(db);
};

export const handleGetRequest = async <TDb>(
  req: Request,
  getDb: () => TDb,
  callback: (db: TDb, page: number, size: number) => Promise<void>
) => {
  const db = getDb();
  const { page, size } = getPaginationQueryStringParams(req.query);
  await callback(db, page, size);
};

export const handleGetByIdRequest = async <TDb>(
  req: Request,
  getDb: () => TDb,
  callback: (db: TDb, page: number, size: number, id: number) => Promise<void>
) => {
  const db = getDb();
  const { id } = req.params;
  const defaultQueryParam = 1;
  await callback(db, defaultQueryParam, defaultQueryParam, +id);
};
