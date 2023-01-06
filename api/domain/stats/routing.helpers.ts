import { NextFunction, Request, Response, Router } from 'express';
import { handleGetStatsRequest } from './handlers';
import {
  MongoCountQueryMethodType,
  MongoGetQueryMethodType,
  PostgresCountQueryMethodType,
  PostgresGetQueryMethodType
} from '../../types/database';

export const registerStatsEndpoint = async (
  router: Router,
  methodName: string,
  postgresQuery: PostgresGetQueryMethodType,
  mongoQuery: MongoGetQueryMethodType,
  postgresCountQuery: PostgresCountQueryMethodType,
  mongoCountQuery: MongoCountQueryMethodType
) => {
  router.get(`/${methodName}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      handleGetStatsRequest(
        req,
        res,
        methodName,
        postgresQuery,
        mongoQuery,
        postgresCountQuery,
        mongoCountQuery
      );
    } catch (error) {
      next(error);
    }
  });
};
