import express, { NextFunction, Request, Response } from 'express';
import { PostgresDb } from './db';
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
import { Quantity } from '../models';

export const router = express.Router();

const registerCountEndpoint = (method: (db: PostgresDb) => Promise<Quantity>) => {
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
  method: (db: PostgresDb, offset: number, limit: number) => Promise<object[]>
) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlePostgresGetRequest(req, async (db, page, size) => {
        const offset = (page - 1) * size;
        const data = await method(db, offset, size);
        res.json(data);
      });
    } catch (error) {
      next(error);
    }
  });
};

const registerGetByIdEndpoint = (
  method: (db: PostgresDb, offset: number, limit: number, id: number) => Promise<object[]>
) => {
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

registerGetEndpoint(getPostgresFood);
registerGetEndpoint(getPostgresBrandedFood);
registerGetEndpoint(getPostgresNutrient);
registerGetEndpoint(getPostgresFoodNutrient);
registerGetEndpoint(getPostgresFoodNutrientDerivation);
registerGetEndpoint(getPostgresFoodNutrientSource);

registerGetEndpoint(getPostgresFullFood);
registerGetEndpoint(getPostgresFullFoodWithNutrients);
registerGetEndpoint(getPostgresFullFoodWithFullNutrients);

registerGetByIdEndpoint(getPostgresFood);
registerGetByIdEndpoint(getPostgresBrandedFood);
registerGetByIdEndpoint(getPostgresNutrient);
registerGetByIdEndpoint(getPostgresFoodNutrient);
registerGetByIdEndpoint(getPostgresFoodNutrientDerivation);
registerGetByIdEndpoint(getPostgresFoodNutrientSource);

registerGetByIdEndpoint(getPostgresFullFood);
registerGetByIdEndpoint(getPostgresFullFoodWithNutrients);
registerGetByIdEndpoint(getPostgresFullFoodWithFullNutrients);
