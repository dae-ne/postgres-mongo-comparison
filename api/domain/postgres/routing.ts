import express, { NextFunction, Request, Response } from 'express';
import {
  handlePostgresCountRequest,
  handlePostgresGetByIdRequest,
  handlePostgresGetRequest
} from './handlers';
import {
  countPostgresBrandedFood,
  countPostgresFood,
  countPostgresFoodNutrient,
  countPostgresFoodNutrientDerivation,
  countPostgresFoodNutrientSource,
  countPostgresNutrient,
  getPostgresBrandedFood,
  getPostgresFood,
  getPostgresFoodNutrient,
  getPostgresFoodNutrientDerivation,
  getPostgresFoodNutrientSource,
  getPostgresFullFood,
  getPostgresFullFoodWithFullNutrients,
  getPostgresFullFoodWithNutrients,
  getPostgresNutrient
} from './queries';
import { PaginatedDto } from '../../types/contracts';
import { PostgresCountQueryMethodType, PostgresGetQueryMethodType } from '../../types/database';

export const router = express.Router();

const registerCountEndpoint = (method: PostgresCountQueryMethodType) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlePostgresCountRequest(req, async (db) => {
        const count = await method(db);
        res.json(count);
      });
    } catch (error) {
      next(error);
    }
  });
};

const registerGetEndpoint = (
  method: PostgresGetQueryMethodType,
  countMethod: PostgresCountQueryMethodType
) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlePostgresGetRequest(req, async (db, page, size) => {
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
      });
    } catch (error) {
      next(error);
    }
  });
};

const registerGetByIdEndpoint = (method: PostgresGetQueryMethodType) => {
  router.get(`/${method.name}/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlePostgresGetByIdRequest(req, async (db, page, size, id) => {
        const offset = (page - 1) * size;
        const data = await method(db, offset, size, id);
        res.json(data[0]);
      });
    } catch (error) {
      next(error);
    }
  });
};

registerCountEndpoint(countPostgresFood);
registerCountEndpoint(countPostgresBrandedFood);
registerCountEndpoint(countPostgresNutrient);
registerCountEndpoint(countPostgresFoodNutrient);
registerCountEndpoint(countPostgresFoodNutrientDerivation);
registerCountEndpoint(countPostgresFoodNutrientSource);

registerGetEndpoint(getPostgresFood, countPostgresFood);
registerGetEndpoint(getPostgresBrandedFood, countPostgresBrandedFood);
registerGetEndpoint(getPostgresNutrient, countPostgresNutrient);
registerGetEndpoint(getPostgresFoodNutrient, countPostgresFoodNutrient);
registerGetEndpoint(getPostgresFoodNutrientDerivation, countPostgresFoodNutrientDerivation);
registerGetEndpoint(getPostgresFoodNutrientSource, countPostgresFoodNutrientSource);

registerGetEndpoint(getPostgresFullFood, countPostgresFood);
registerGetEndpoint(getPostgresFullFoodWithNutrients, countPostgresFood);
registerGetEndpoint(getPostgresFullFoodWithFullNutrients, countPostgresFood);

registerGetByIdEndpoint(getPostgresFood);
registerGetByIdEndpoint(getPostgresBrandedFood);
registerGetByIdEndpoint(getPostgresNutrient);
registerGetByIdEndpoint(getPostgresFoodNutrient);
registerGetByIdEndpoint(getPostgresFoodNutrientDerivation);
registerGetByIdEndpoint(getPostgresFoodNutrientSource);

registerGetByIdEndpoint(getPostgresFullFood);
registerGetByIdEndpoint(getPostgresFullFoodWithNutrients);
registerGetByIdEndpoint(getPostgresFullFoodWithFullNutrients);
