import express, { Request, Response } from 'express';
import { PostgresDb } from '../connections/postgres';
import { handlePostgresCountRequest, handlePostgresGetRequest } from '../handlers/requests';
import { Quantity } from '../models/Quantity';
import {
  countPostgresBrandedFood,
  countPostgresFood,
  countPostgresFoodNutrient,
  countPostgresFoodNutrientDerivation,
  countPostgresFoodNutrientSource,
  countPostgresNutrient,
  getPostgresFood,
  getPostgresFullFood,
  getPostgresFullFoodWithFullNutrients,
  getPostgresFullFoodWithNutrients
} from '../queries/postgres';

export const router = express.Router();

const registerCountEndpoint = (method: (db: PostgresDb) => Promise<Quantity>) => {
  router.get(`/${method.name}`, async (req: Request, res: Response) => {
    await handlePostgresCountRequest(req, async (db) => {
      const count = await method(db);
      res.json(count);
    });
  });
};

const registerGetEndpoint = (
  method: (db: PostgresDb, offset: number, limit: number) => Promise<object[]>
) => {
  router.get(`/${method.name}`, async (req: Request, res: Response) => {
    await handlePostgresGetRequest(req, async (db, page, size) => {
      const offset = (page - 1) * size;
      const data = await method(db, offset, size);
      res.json(data);
    });
  });
};

registerCountEndpoint(countPostgresFood);
registerCountEndpoint(countPostgresBrandedFood);
registerCountEndpoint(countPostgresNutrient);
registerCountEndpoint(countPostgresFoodNutrient);
registerCountEndpoint(countPostgresFoodNutrientDerivation);
registerCountEndpoint(countPostgresFoodNutrientSource);

registerGetEndpoint(getPostgresFood);
registerGetEndpoint(getPostgresFullFood);
registerGetEndpoint(getPostgresFullFoodWithNutrients);
registerGetEndpoint(getPostgresFullFoodWithFullNutrients);
