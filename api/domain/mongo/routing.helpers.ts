import { Router, NextFunction, Request, Response } from 'express';
import { PaginatedDto } from '../../types/contracts';
import { MongoCountQueryMethodType, MongoDb, MongoGetQueryMethodType } from '../../types/database';
import { handleCountRequest, handleGetByIdRequest, handleGetRequest } from '../common/handlers';

const getDb = (req: Request): MongoDb => req.app.locals.mongoDb;

export const registerCountEndpoint = (router: Router, method: MongoCountQueryMethodType) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleCountRequest(
        () => getDb(req),
        async (db) => {
          const count = await method(db);
          res.json(count);
        }
      );
    } catch (error) {
      next(error);
    }
  });
};

export const registerGetEndpoint = (
  router: Router,
  method: MongoGetQueryMethodType,
  countMethod: MongoCountQueryMethodType
) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleGetRequest(
        req,
        () => getDb(req),
        async (db, page, size) => {
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
        }
      );
    } catch (error) {
      next(error);
    }
  });
};

export const registerGetByIdEndpoint = (router: Router, method: MongoGetQueryMethodType) => {
  router.get(`/${method.name}/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleGetByIdRequest(
        req,
        () => getDb(req),
        async (db, page, size, id) => {
          const skip = (page - 1) * size;
          const data = await method(db, skip, size, id);
          res.json(data[0]);
        }
      );
    } catch (error) {
      next(error);
    }
  });
};
