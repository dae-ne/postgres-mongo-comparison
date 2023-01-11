import { NextFunction, Request, Response, Router } from 'express';
import { handleAddUpdateDeleteStatsRequest, handleGetStatsRequest } from './handlers';
import {
  MongoAddQueryMethodType,
  MongoCountQueryMethodType,
  MongoDeleteQueryMethodType,
  MongoGetQueryMethodType,
  MongoUpdateQueryMethodType,
  PostgresAddQueryMethodType,
  PostgresCountQueryMethodType,
  PostgresDeleteQueryMethodType,
  PostgresGetQueryMethodType,
  PostgresUpdateQueryMethodType
} from '../../types/database';

export const registerStatsGetEndpoint = async (
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

export const registerStatsAddUpdateDeleteEndpoint = async (
  router: Router,
  methodName: string,
  postgresAddQuery: PostgresAddQueryMethodType,
  postgresUpdateQuery: PostgresUpdateQueryMethodType,
  postgresDeleteQuery: PostgresDeleteQueryMethodType,
  mongoAddQuery: MongoAddQueryMethodType,
  mongoUpdateQuery: MongoUpdateQueryMethodType,
  mongoDeleteQuery: MongoDeleteQueryMethodType
) => {
  router.post(`/${methodName}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      handleAddUpdateDeleteStatsRequest(
        req,
        res,
        methodName,
        postgresAddQuery,
        postgresUpdateQuery,
        postgresDeleteQuery,
        mongoAddQuery,
        mongoUpdateQuery,
        mongoDeleteQuery
      );
    } catch (error) {
      next(error);
    }
  });
};
