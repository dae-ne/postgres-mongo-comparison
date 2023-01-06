import express, { Request, Response } from 'express';
import { handleGetStatsRequest } from './handlers';
import { Quantity } from '../../models/Quantity';
import { MongoDb } from '../mongo/db';
import {
  countMongoBrandedFood,
  countMongoFood,
  countMongoFoodNutrient,
  countMongoFoodNutrientDerivation,
  countMongoFoodNutrientSource,
  countMongoNutrient,
  getMongoBrandedFood,
  getMongoFood,
  getMongoFoodNutrient,
  getMongoFoodNutrientDerivation,
  getMongoFoodNutrientSource,
  getMongoFullFood,
  getMongoFullFoodWithFullNutrients,
  getMongoFullFoodWithNutrients,
  getMongoNutrient
} from '../mongo/queries';
import { PostgresDb } from '../postgres/db';
import {
  countPostgresBrandedFood,
  countPostgresFood,
  getPostgresBrandedFood,
  getPostgresFood,
  getPostgresNutrient,
  getPostgresFullFood,
  getPostgresFullFoodWithFullNutrients,
  getPostgresFullFoodWithNutrients,
  countPostgresNutrient,
  getPostgresFoodNutrient,
  countPostgresFoodNutrient,
  getPostgresFoodNutrientDerivation,
  countPostgresFoodNutrientDerivation,
  getPostgresFoodNutrientSource,
  countPostgresFoodNutrientSource
} from '../postgres/queries';

export const router = express.Router();

const registerStatsEndpoint = async (
  methodName: string,
  postgresQuery: (db: PostgresDb, page: number, size: number) => Promise<object[]>,
  mongoQuery: (db: MongoDb, page: number, size: number) => Promise<object[]>,
  postgresCountQuery: (db: PostgresDb) => Promise<Quantity>,
  mongoCountQuery: (db: MongoDb) => Promise<Quantity>
) => {
  router.get(`/${methodName}`, async (req: Request, res: Response) =>
    handleGetStatsRequest(
      req,
      res,
      methodName,
      postgresQuery,
      mongoQuery,
      postgresCountQuery,
      mongoCountQuery
    )
  );
};

registerStatsEndpoint(
  'getFoodStats',
  getPostgresFood,
  getMongoFood,
  countPostgresFood,
  countMongoFood
);

registerStatsEndpoint(
  'getBrandedFoodStats',
  getPostgresBrandedFood,
  getMongoBrandedFood,
  countPostgresBrandedFood,
  countMongoBrandedFood
);

registerStatsEndpoint(
  'getNutrientStats',
  getPostgresNutrient,
  getMongoNutrient,
  countPostgresNutrient,
  countMongoNutrient
);

registerStatsEndpoint(
  'getFoodNutrientStats',
  getPostgresFoodNutrient,
  getMongoFoodNutrient,
  countPostgresFoodNutrient,
  countMongoFoodNutrient
);

registerStatsEndpoint(
  'getFoodNutrientDerivationStats',
  getPostgresFoodNutrientDerivation,
  getMongoFoodNutrientDerivation,
  countPostgresFoodNutrientDerivation,
  countMongoFoodNutrientDerivation
);

registerStatsEndpoint(
  'getFoodNutrientSourceStats',
  getPostgresFoodNutrientSource,
  getMongoFoodNutrientSource,
  countPostgresFoodNutrientSource,
  countMongoFoodNutrientSource
);

registerStatsEndpoint(
  'getFullFoodStats',
  getPostgresFullFood,
  getMongoFullFood,
  countPostgresFood,
  countMongoFood
);

registerStatsEndpoint(
  'getFullFoodWithNutrientsStats',
  getPostgresFullFoodWithNutrients,
  getMongoFullFoodWithNutrients,
  countPostgresFood,
  countMongoFood
);

registerStatsEndpoint(
  'getFullFoodWithFullNutrientsStats',
  getPostgresFullFoodWithFullNutrients,
  getMongoFullFoodWithFullNutrients,
  countPostgresFood,
  countMongoFood
);
