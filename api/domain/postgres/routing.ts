import { Router } from 'express';
import * as queries from './queries';
import * as helpers from '../common/routing.helpers';

export const router = Router();

helpers.registerCountEndpoint(router, helpers.getPostgresDb, queries.countPostgresFood);
helpers.registerCountEndpoint(router, helpers.getPostgresDb, queries.countPostgresBrandedFood);
helpers.registerCountEndpoint(router, helpers.getPostgresDb, queries.countPostgresNutrient);
helpers.registerCountEndpoint(router, helpers.getPostgresDb, queries.countPostgresFoodNutrient);
helpers.registerCountEndpoint(router, helpers.getPostgresDb, queries.countPostgresFoodNutrientDerivation);
helpers.registerCountEndpoint(router, helpers.getPostgresDb, queries.countPostgresFoodNutrientSource);

helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresFood, queries.countPostgresFood);
helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresBrandedFood, queries.countPostgresBrandedFood);
helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresNutrient, queries.countPostgresNutrient);
helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresFoodNutrient, queries.countPostgresFoodNutrient);
helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresFoodNutrientDerivation, queries.countPostgresFoodNutrientDerivation);
helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresFoodNutrientSource, queries.countPostgresFoodNutrientSource);

helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresFullFood, queries.countPostgresFood);
helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresFullFoodWithNutrients, queries.countPostgresFood);
helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresFullFoodWithFullNutrients, queries.countPostgresFood);

helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresFood);
helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresBrandedFood);
helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresNutrient);
helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresFoodNutrient);
helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresFoodNutrientDerivation);
helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresFoodNutrientSource);

helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresFullFood);
helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresFullFoodWithNutrients);
helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresFullFoodWithFullNutrients);

helpers.registerCountEndpoint(router, helpers.getPostgresDb, queries.countPostgresTest);
helpers.registerGetByIdEndpoint(router, helpers.getPostgresDb, queries.getPostgresTest);
helpers.registerGetEndpoint(router, helpers.getPostgresDb, queries.getPostgresTest, queries.countPostgresFood);
helpers.registerPostEndpoint(router, helpers.getPostgresDb, queries.addPostgresMany);
helpers.registerPutEndpoint(router, helpers.getPostgresDb, queries.updatePostgresAll);
helpers.registerDeleteEndpoint(router, helpers.getPostgresDb, queries.deletePostgresAll);
