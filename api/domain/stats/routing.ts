import { Router } from 'express';
import { registerStatsEndpoint } from './routing.helpers';
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

export const router = Router();

registerStatsEndpoint(
  router,
  'getFoodStats',
  getPostgresFood,
  getMongoFood,
  countPostgresFood,
  countMongoFood
);

registerStatsEndpoint(
  router,
  'getBrandedFoodStats',
  getPostgresBrandedFood,
  getMongoBrandedFood,
  countPostgresBrandedFood,
  countMongoBrandedFood
);

registerStatsEndpoint(
  router,
  'getNutrientStats',
  getPostgresNutrient,
  getMongoNutrient,
  countPostgresNutrient,
  countMongoNutrient
);

registerStatsEndpoint(
  router,
  'getFoodNutrientStats',
  getPostgresFoodNutrient,
  getMongoFoodNutrient,
  countPostgresFoodNutrient,
  countMongoFoodNutrient
);

registerStatsEndpoint(
  router,
  'getFoodNutrientDerivationStats',
  getPostgresFoodNutrientDerivation,
  getMongoFoodNutrientDerivation,
  countPostgresFoodNutrientDerivation,
  countMongoFoodNutrientDerivation
);

registerStatsEndpoint(
  router,
  'getFoodNutrientSourceStats',
  getPostgresFoodNutrientSource,
  getMongoFoodNutrientSource,
  countPostgresFoodNutrientSource,
  countMongoFoodNutrientSource
);

registerStatsEndpoint(
  router,
  'getFullFoodStats',
  getPostgresFullFood,
  getMongoFullFood,
  countPostgresFood,
  countMongoFood
);

registerStatsEndpoint(
  router,
  'getFullFoodWithNutrientsStats',
  getPostgresFullFoodWithNutrients,
  getMongoFullFoodWithNutrients,
  countPostgresFood,
  countMongoFood
);

registerStatsEndpoint(
  router,
  'getFullFoodWithFullNutrientsStats',
  getPostgresFullFoodWithFullNutrients,
  getMongoFullFoodWithFullNutrients,
  countPostgresFood,
  countMongoFood
);
