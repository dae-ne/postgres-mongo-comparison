import { Router } from 'express';
import { registerStatsAddUpdateDeleteEndpoint, registerStatsGetEndpoint } from './routing.helpers';
import * as mongoQueries from '../mongo/queries';
import * as postgresQueries from '../postgres/queries';

export const router = Router();

registerStatsGetEndpoint(
  router,
  'getFoodStats',
  postgresQueries.getPostgresFood,
  mongoQueries.getMongoFood,
  postgresQueries.countPostgresFood,
  mongoQueries.countMongoFood
);

registerStatsGetEndpoint(
  router,
  'getBrandedFoodStats',
  postgresQueries.getPostgresBrandedFood,
  mongoQueries.getMongoBrandedFood,
  postgresQueries.countPostgresBrandedFood,
  mongoQueries.countMongoBrandedFood
);

registerStatsGetEndpoint(
  router,
  'getNutrientStats',
  postgresQueries.getPostgresNutrient,
  mongoQueries.getMongoNutrient,
  postgresQueries.countPostgresNutrient,
  mongoQueries.countMongoNutrient
);

registerStatsGetEndpoint(
  router,
  'getFoodNutrientStats',
  postgresQueries.getPostgresFoodNutrient,
  mongoQueries.getMongoFoodNutrient,
  postgresQueries.countPostgresFoodNutrient,
  mongoQueries.countMongoFoodNutrient
);

registerStatsGetEndpoint(
  router,
  'getFoodNutrientDerivationStats',
  postgresQueries.getPostgresFoodNutrientDerivation,
  mongoQueries.getMongoFoodNutrientDerivation,
  postgresQueries.countPostgresFoodNutrientDerivation,
  mongoQueries.countMongoFoodNutrientDerivation
);

registerStatsGetEndpoint(
  router,
  'getFoodNutrientSourceStats',
  postgresQueries.getPostgresFoodNutrientSource,
  mongoQueries.getMongoFoodNutrientSource,
  postgresQueries.countPostgresFoodNutrientSource,
  mongoQueries.countMongoFoodNutrientSource
);

registerStatsGetEndpoint(
  router,
  'getFullFoodStats',
  postgresQueries.getPostgresFullFood,
  mongoQueries.getMongoFullFood,
  postgresQueries.countPostgresFood,
  mongoQueries.countMongoFood
);

registerStatsGetEndpoint(
  router,
  'getFullFoodWithNutrientsStats',
  postgresQueries.getPostgresFullFoodWithNutrients,
  mongoQueries.getMongoFullFoodWithNutrients,
  postgresQueries.countPostgresFood,
  mongoQueries.countMongoFood
);

registerStatsGetEndpoint(
  router,
  'getFullFoodWithFullNutrientsStats',
  postgresQueries.getPostgresFullFoodWithFullNutrients,
  mongoQueries.getMongoFullFoodWithFullNutrients,
  postgresQueries.countPostgresFood,
  mongoQueries.countMongoFood
);

registerStatsAddUpdateDeleteEndpoint(
  router,
  'getAddUpdateDeleteStats',
  postgresQueries.addPostgresMany,
  postgresQueries.updatePostgresAll,
  postgresQueries.deletePostgresAll,
  mongoQueries.addMongoMany,
  mongoQueries.updateMongoAll,
  mongoQueries.deleteMongoAll
);
