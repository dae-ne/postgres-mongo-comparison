import { Router } from 'express';
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
} from './queries';
import {
  registerCountEndpoint,
  registerGetByIdEndpoint,
  registerGetEndpoint
} from './routing.helpers';

export const router = Router();

registerCountEndpoint(router, countMongoFood);
registerCountEndpoint(router, countMongoBrandedFood);
registerCountEndpoint(router, countMongoNutrient);
registerCountEndpoint(router, countMongoFoodNutrient);
registerCountEndpoint(router, countMongoFoodNutrientDerivation);
registerCountEndpoint(router, countMongoFoodNutrientSource);

registerGetEndpoint(router, getMongoFood, countMongoFood);
registerGetEndpoint(router, getMongoBrandedFood, countMongoBrandedFood);
registerGetEndpoint(router, getMongoNutrient, countMongoNutrient);
registerGetEndpoint(router, getMongoFoodNutrient, countMongoFoodNutrient);
registerGetEndpoint(router, getMongoFoodNutrientDerivation, countMongoFoodNutrientDerivation);
registerGetEndpoint(router, getMongoFoodNutrientSource, countMongoFoodNutrientSource);

registerGetEndpoint(router, getMongoFullFood, countMongoFood);
registerGetEndpoint(router, getMongoFullFoodWithNutrients, countMongoFood);
registerGetEndpoint(router, getMongoFullFoodWithFullNutrients, countMongoFood);

registerGetByIdEndpoint(router, getMongoFood);
registerGetByIdEndpoint(router, getMongoBrandedFood);
registerGetByIdEndpoint(router, getMongoNutrient);
registerGetByIdEndpoint(router, getMongoFoodNutrient);
registerGetByIdEndpoint(router, getMongoFoodNutrientDerivation);
registerGetByIdEndpoint(router, getMongoFoodNutrientSource);

registerGetByIdEndpoint(router, getMongoFullFood);
registerGetByIdEndpoint(router, getMongoFullFoodWithNutrients);
registerGetByIdEndpoint(router, getMongoFullFoodWithFullNutrients);
