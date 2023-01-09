import { Router, Request, Response, NextFunction } from 'express';
import { pageWithSizeToOffset } from '../../library/query-strings';
import { PaginatedDto } from '../../types/contracts';
import {
  PostgresCountQueryMethodType,
  PostgresDb,
  PostgresGetQueryMethodType
} from '../../types/database';
import { handleCountRequest, handleGetByIdRequest, handleGetRequest } from '../common/handlers';

const getDb = (req: Request): PostgresDb => req.app.locals.postgresDb;

export const registerCountEndpoint = (router: Router, method: PostgresCountQueryMethodType) => {
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
  method: PostgresGetQueryMethodType,
  countMethod: PostgresCountQueryMethodType
) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleGetRequest(
        req,
        () => getDb(req),
        async (db, page, size) => {
          const offset = (page - 1) * size;
          const data = await method(db, offset, size, null);
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

export const registerGetByIdEndpoint = (router: Router, method: PostgresGetQueryMethodType) => {
  router.get(`/${method.name}/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleGetByIdRequest(
        req,
        () => getDb(req),
        async (db, page, size, id) => {
          const offset = pageWithSizeToOffset(page, size);
          const data = await method(db, offset, size, id);
          res.json(data[0]);
        }
      );
    } catch (error) {
      next(error);
    }
  });
};
