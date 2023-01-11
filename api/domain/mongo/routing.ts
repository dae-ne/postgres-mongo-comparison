import { Router } from 'express';
import * as queries from './queries';
import {
  getMongoDb,
  registerCountEndpoint,
  registerDeleteEndpoint,
  registerGetByIdEndpoint,
  registerGetEndpoint,
  registerPostEndpoint,
  registerPutEndpoint
} from '../common/routing';

export const router = Router();

registerCountEndpoint(router, getMongoDb, queries.countMongoFood);
registerCountEndpoint(router, getMongoDb, queries.countMongoBrandedFood);
registerCountEndpoint(router, getMongoDb, queries.countMongoNutrient);
registerCountEndpoint(router, getMongoDb, queries.countMongoFoodNutrient);
registerCountEndpoint(router, getMongoDb, queries.countMongoFoodNutrientDerivation);
registerCountEndpoint(router, getMongoDb, queries.countMongoFoodNutrientSource);

registerGetEndpoint(router, getMongoDb, queries.getMongoFood, queries.countMongoFood);
registerGetEndpoint(router, getMongoDb, queries.getMongoBrandedFood, queries.countMongoBrandedFood);
registerGetEndpoint(router, getMongoDb, queries.getMongoNutrient, queries.countMongoNutrient);
registerGetEndpoint(
  router,
  getMongoDb,
  queries.getMongoFoodNutrient,
  queries.countMongoFoodNutrient
);
registerGetEndpoint(
  router,
  getMongoDb,
  queries.getMongoFoodNutrientDerivation,
  queries.countMongoFoodNutrientDerivation
);
registerGetEndpoint(
  router,
  getMongoDb,
  queries.getMongoFoodNutrientSource,
  queries.countMongoFoodNutrientSource
);

registerGetEndpoint(router, getMongoDb, queries.getMongoFullFood, queries.countMongoFood);
registerGetEndpoint(
  router,
  getMongoDb,
  queries.getMongoFullFoodWithNutrients,
  queries.countMongoFood
);
registerGetEndpoint(
  router,
  getMongoDb,
  queries.getMongoFullFoodWithFullNutrients,
  queries.countMongoFood
);

registerGetByIdEndpoint(router, getMongoDb, queries.getMongoFood);
registerGetByIdEndpoint(router, getMongoDb, queries.getMongoBrandedFood);
registerGetByIdEndpoint(router, getMongoDb, queries.getMongoNutrient);
registerGetByIdEndpoint(router, getMongoDb, queries.getMongoFoodNutrient);
registerGetByIdEndpoint(router, getMongoDb, queries.getMongoFoodNutrientDerivation);
registerGetByIdEndpoint(router, getMongoDb, queries.getMongoFoodNutrientSource);

registerGetByIdEndpoint(router, getMongoDb, queries.getMongoFullFood);
registerGetByIdEndpoint(router, getMongoDb, queries.getMongoFullFoodWithNutrients);
registerGetByIdEndpoint(router, getMongoDb, queries.getMongoFullFoodWithFullNutrients);

registerCountEndpoint(router, getMongoDb, queries.countMongoTest);
registerGetByIdEndpoint(router, getMongoDb, queries.getMongoTest);
registerGetEndpoint(router, getMongoDb, queries.getMongoTest, queries.countMongoFood);
registerPostEndpoint(router, getMongoDb, queries.addMongoMany);
registerPutEndpoint(router, getMongoDb, queries.updateMongoAll);
registerDeleteEndpoint(router, getMongoDb, queries.deleteMongoAll);
