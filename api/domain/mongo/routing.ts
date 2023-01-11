import { Router } from 'express';
import * as queries from './queries';
import * as helpers from '../common/routing.helpers';

export const router = Router();

helpers.registerCountEndpoint(router, helpers.getMongoDb, queries.countMongoFood);
helpers.registerCountEndpoint(router, helpers.getMongoDb, queries.countMongoBrandedFood);
helpers.registerCountEndpoint(router, helpers.getMongoDb, queries.countMongoNutrient);
helpers.registerCountEndpoint(router, helpers.getMongoDb, queries.countMongoFoodNutrient);
helpers.registerCountEndpoint(router, helpers.getMongoDb, queries.countMongoFoodNutrientDerivation);
helpers.registerCountEndpoint(router, helpers.getMongoDb, queries.countMongoFoodNutrientSource);

helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoFood, queries.countMongoFood);
helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoBrandedFood, queries.countMongoBrandedFood);
helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoNutrient, queries.countMongoNutrient);
helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoFoodNutrient, queries.countMongoFoodNutrient);
helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoFoodNutrientDerivation, queries.countMongoFoodNutrientDerivation);
helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoFoodNutrientSource, queries.countMongoFoodNutrientSource);

helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoFullFood, queries.countMongoFood);
helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoFullFoodWithNutrients, queries.countMongoFood);
helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoFullFoodWithFullNutrients, queries.countMongoFood);

helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoFood);
helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoBrandedFood);
helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoNutrient);
helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoFoodNutrient);
helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoFoodNutrientDerivation);
helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoFoodNutrientSource);

helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoFullFood);
helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoFullFoodWithNutrients);
helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoFullFoodWithFullNutrients);

helpers.registerCountEndpoint(router, helpers.getMongoDb, queries.countMongoTest);
helpers.registerGetByIdEndpoint(router, helpers.getMongoDb, queries.getMongoTest);
helpers.registerGetEndpoint(router, helpers.getMongoDb, queries.getMongoTest, queries.countMongoTest);
helpers.registerPostEndpoint(router, helpers.getMongoDb, queries.addMongoMany);
helpers.registerPutEndpoint(router, helpers.getMongoDb, queries.updateMongoAll);
helpers.registerDeleteEndpoint(router, helpers.getMongoDb, queries.deleteMongoAll);
