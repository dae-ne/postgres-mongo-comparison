import { Router } from 'express';
import * as queries from './queries';
import {
  getPostgresDb,
  registerCountEndpoint,
  registerDeleteEndpoint,
  registerGetByIdEndpoint,
  registerGetEndpoint,
  registerPostEndpoint,
  registerPutEndpoint
} from '../common/routing';

export const router = Router();

registerCountEndpoint(router, getPostgresDb, queries.countPostgresFood);
registerCountEndpoint(router, getPostgresDb, queries.countPostgresBrandedFood);
registerCountEndpoint(router, getPostgresDb, queries.countPostgresNutrient);
registerCountEndpoint(router, getPostgresDb, queries.countPostgresFoodNutrient);
registerCountEndpoint(router, getPostgresDb, queries.countPostgresFoodNutrientDerivation);
registerCountEndpoint(router, getPostgresDb, queries.countPostgresFoodNutrientSource);

registerGetEndpoint(router, getPostgresDb, queries.getPostgresFood, queries.countPostgresFood);
registerGetEndpoint(
  router,
  getPostgresDb,
  queries.getPostgresBrandedFood,
  queries.countPostgresBrandedFood
);
registerGetEndpoint(
  router,
  getPostgresDb,
  queries.getPostgresNutrient,
  queries.countPostgresNutrient
);
registerGetEndpoint(
  router,
  getPostgresDb,
  queries.getPostgresFoodNutrient,
  queries.countPostgresFoodNutrient
);
registerGetEndpoint(
  router,
  getPostgresDb,
  queries.getPostgresFoodNutrientDerivation,
  queries.countPostgresFoodNutrientDerivation
);
registerGetEndpoint(
  router,
  getPostgresDb,
  queries.getPostgresFoodNutrientSource,
  queries.countPostgresFoodNutrientSource
);

registerGetEndpoint(router, getPostgresDb, queries.getPostgresFullFood, queries.countPostgresFood);
registerGetEndpoint(
  router,
  getPostgresDb,
  queries.getPostgresFullFoodWithNutrients,
  queries.countPostgresFood
);
registerGetEndpoint(
  router,
  getPostgresDb,
  queries.getPostgresFullFoodWithFullNutrients,
  queries.countPostgresFood
);

registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresFood);
registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresBrandedFood);
registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresNutrient);
registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresFoodNutrient);
registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresFoodNutrientDerivation);
registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresFoodNutrientSource);

registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresFullFood);
registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresFullFoodWithNutrients);
registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresFullFoodWithFullNutrients);

registerCountEndpoint(router, getPostgresDb, queries.countPostgresTest);
registerGetByIdEndpoint(router, getPostgresDb, queries.getPostgresTest);
registerGetEndpoint(router, getPostgresDb, queries.getPostgresTest, queries.countPostgresFood);
registerPostEndpoint(router, getPostgresDb, queries.addPostgresMany);
registerPutEndpoint(router, getPostgresDb, queries.updatePostgresAll);
registerDeleteEndpoint(router, getPostgresDb, queries.deletePostgresAll);
