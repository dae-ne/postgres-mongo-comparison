import { NextFunction, Request, Response, Router } from 'express';
import { handleAddUpdateDeleteStatsRequest, handleGetStatsRequest } from './handlers';
import * as dbTypes from '../../types/database';

export const registerStatsGetEndpoint = async (
  router: Router,
  methodName: string,
  postgresQuery: dbTypes.PostgresGetQueryMethodType,
  mongoQuery: dbTypes.MongoGetQueryMethodType,
  postgresCountQuery: dbTypes.PostgresCountQueryMethodType,
  mongoCountQuery: dbTypes.MongoCountQueryMethodType
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
  postgresAddQuery: dbTypes.PostgresAddQueryMethodType,
  postgresUpdateQuery: dbTypes.PostgresUpdateQueryMethodType,
  postgresDeleteQuery: dbTypes.PostgresDeleteQueryMethodType,
  mongoAddQuery: dbTypes.MongoAddQueryMethodType,
  mongoUpdateQuery: dbTypes.MongoUpdateQueryMethodType,
  mongoDeleteQuery: dbTypes.MongoDeleteQueryMethodType
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
