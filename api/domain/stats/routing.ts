import { Router } from 'express';
import { registerStatsAddUpdateDeleteEndpoint, registerStatsGetEndpoint } from './routing.helpers';
import {
  addMongoMany,
  countMongoBrandedFood,
  countMongoFood,
  countMongoFoodNutrient,
  countMongoFoodNutrientDerivation,
  countMongoFoodNutrientSource,
  countMongoNutrient,
  deleteMongoAll,
  getMongoBrandedFood,
  getMongoFood,
  getMongoFoodNutrient,
  getMongoFoodNutrientDerivation,
  getMongoFoodNutrientSource,
  getMongoFullFood,
  getMongoFullFoodWithFullNutrients,
  getMongoFullFoodWithNutrients,
  getMongoNutrient,
  updateMongoAll
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
  countPostgresFoodNutrientSource,
  addPostgresMany,
  updatePostgresAll,
  deletePostgresAll
} from '../postgres/queries';

export const router = Router();

registerStatsGetEndpoint(
  router,
  'getFoodStats',
  getPostgresFood,
  getMongoFood,
  countPostgresFood,
  countMongoFood
);

registerStatsGetEndpoint(
  router,
  'getBrandedFoodStats',
  getPostgresBrandedFood,
  getMongoBrandedFood,
  countPostgresBrandedFood,
  countMongoBrandedFood
);

registerStatsGetEndpoint(
  router,
  'getNutrientStats',
  getPostgresNutrient,
  getMongoNutrient,
  countPostgresNutrient,
  countMongoNutrient
);

registerStatsGetEndpoint(
  router,
  'getFoodNutrientStats',
  getPostgresFoodNutrient,
  getMongoFoodNutrient,
  countPostgresFoodNutrient,
  countMongoFoodNutrient
);

registerStatsGetEndpoint(
  router,
  'getFoodNutrientDerivationStats',
  getPostgresFoodNutrientDerivation,
  getMongoFoodNutrientDerivation,
  countPostgresFoodNutrientDerivation,
  countMongoFoodNutrientDerivation
);

registerStatsGetEndpoint(
  router,
  'getFoodNutrientSourceStats',
  getPostgresFoodNutrientSource,
  getMongoFoodNutrientSource,
  countPostgresFoodNutrientSource,
  countMongoFoodNutrientSource
);

registerStatsGetEndpoint(
  router,
  'getFullFoodStats',
  getPostgresFullFood,
  getMongoFullFood,
  countPostgresFood,
  countMongoFood
);

registerStatsGetEndpoint(
  router,
  'getFullFoodWithNutrientsStats',
  getPostgresFullFoodWithNutrients,
  getMongoFullFoodWithNutrients,
  countPostgresFood,
  countMongoFood
);

registerStatsGetEndpoint(
  router,
  'getFullFoodWithFullNutrientsStats',
  getPostgresFullFoodWithFullNutrients,
  getMongoFullFoodWithFullNutrients,
  countPostgresFood,
  countMongoFood
);

registerStatsAddUpdateDeleteEndpoint(
  router,
  'getAddUpdateDeleteStats',
  addPostgresMany,
  updatePostgresAll,
  deletePostgresAll,
  addMongoMany,
  updateMongoAll,
  deleteMongoAll
);
