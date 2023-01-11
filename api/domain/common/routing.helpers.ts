import { Router, NextFunction, Request, Response } from 'express';
import { getPaginationQueryStringParams } from '../../library/query-strings';
import { PaginatedDto } from '../../types/contracts';
import {
  DbCountQueryMethodType,
  DbGetQueryMethodType,
  MongoDb,
  PostgresDb
} from '../../types/database';
import { TestData, TestDataWithoutId } from '../../types/models';

type GetDbMethodType<TDb extends PostgresDb | MongoDb> = (req: Request) => TDb;

export const getPostgresDb: GetDbMethodType<PostgresDb> = (req: Request): PostgresDb =>
  req.app.locals.postgresDb;

export const getMongoDb: GetDbMethodType<MongoDb> = (req: Request): MongoDb =>
  req.app.locals.mongoDb;

export const registerCountEndpoint = <TDb extends PostgresDb | MongoDb>(
  router: Router,
  getDb: GetDbMethodType<TDb>,
  method: DbCountQueryMethodType<TDb>
) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = getDb(req);
      const count = await method(db);
      res.json(count);
    } catch (error) {
      next(error);
    }
  });
};

export const registerGetEndpoint = <TDb extends PostgresDb | MongoDb>(
  router: Router,
  getDb: GetDbMethodType<TDb>,
  method: DbGetQueryMethodType<TDb>,
  countMethod: DbCountQueryMethodType<TDb>
) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, size } = getPaginationQueryStringParams(req.query);
      const db = getDb(req);
      const skip = (page - 1) * size;
      const data = await method(db, skip, size, null);
      const { count: total } = await countMethod(db);

      const response: PaginatedDto = {
        count: data.length,
        page,
        total,
        data
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  });
};

export const registerGetByIdEndpoint = <
  TDb extends PostgresDb | MongoDb,
  TMethod extends DbGetQueryMethodType<TDb>
>(
  router: Router,
  getDb: GetDbMethodType<TDb>,
  method: TMethod
) => {
  router.get(`/${method.name}/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const db = getDb(req);
      const skip = 0;
      const size = 1;
      const data = await method(db, skip, size, +id);
      res.json(data[0]);
    } catch (error) {
      next(error);
    }
  });
};

export const registerPostEndpoint = <
  TDb extends PostgresDb | MongoDb,
  TData extends TestData | TestData[]
>(
  router: Router,
  getDb: GetDbMethodType<TDb>,
  method: (db: TDb, data: TData) => Promise<void>
) => {
  router.post(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const db = getDb(req);
      await method(db, body);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  });
};

export const registerPutEndpoint = <
  TDb extends PostgresDb | MongoDb,
  TData extends TestDataWithoutId | TestDataWithoutId[]
>(
  router: Router,
  getDb: GetDbMethodType<TDb>,
  method: (db: TDb, data: TData) => Promise<void>
) => {
  router.put(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const db = getDb(req);
      await method(db, body);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  });
};

export const registerDeleteEndpoint = <TDb extends PostgresDb | MongoDb>(
  router: Router,
  getDb: GetDbMethodType<TDb>,
  method: (db: TDb) => Promise<void>
) => {
  router.delete(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = getDb(req);
      await method(db);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  });
};
