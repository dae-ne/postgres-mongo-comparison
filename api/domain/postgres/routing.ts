import { Router } from 'express';
import {
  countPostgresBrandedFood,
  countPostgresFood,
  countPostgresFoodNutrient,
  countPostgresFoodNutrientDerivation,
  countPostgresFoodNutrientSource,
  countPostgresNutrient,
  getPostgresBrandedFood,
  getPostgresFood,
  getPostgresFoodNutrient,
  getPostgresFoodNutrientDerivation,
  getPostgresFoodNutrientSource,
  getPostgresFullFood,
  getPostgresFullFoodWithFullNutrients,
  getPostgresFullFoodWithNutrients,
  getPostgresNutrient
} from './queries';
import {
  registerCountEndpoint,
  registerGetByIdEndpoint,
  registerGetEndpoint
} from './routing.helpers';

export const router = Router();

registerCountEndpoint(router, countPostgresFood);
registerCountEndpoint(router, countPostgresBrandedFood);
registerCountEndpoint(router, countPostgresNutrient);
registerCountEndpoint(router, countPostgresFoodNutrient);
registerCountEndpoint(router, countPostgresFoodNutrientDerivation);
registerCountEndpoint(router, countPostgresFoodNutrientSource);

registerGetEndpoint(router, getPostgresFood, countPostgresFood);
registerGetEndpoint(router, getPostgresBrandedFood, countPostgresBrandedFood);
registerGetEndpoint(router, getPostgresNutrient, countPostgresNutrient);
registerGetEndpoint(router, getPostgresFoodNutrient, countPostgresFoodNutrient);
registerGetEndpoint(router, getPostgresFoodNutrientDerivation, countPostgresFoodNutrientDerivation);
registerGetEndpoint(router, getPostgresFoodNutrientSource, countPostgresFoodNutrientSource);

registerGetEndpoint(router, getPostgresFullFood, countPostgresFood);
registerGetEndpoint(router, getPostgresFullFoodWithNutrients, countPostgresFood);
registerGetEndpoint(router, getPostgresFullFoodWithFullNutrients, countPostgresFood);

registerGetByIdEndpoint(router, getPostgresFood);
registerGetByIdEndpoint(router, getPostgresBrandedFood);
registerGetByIdEndpoint(router, getPostgresNutrient);
registerGetByIdEndpoint(router, getPostgresFoodNutrient);
registerGetByIdEndpoint(router, getPostgresFoodNutrientDerivation);
registerGetByIdEndpoint(router, getPostgresFoodNutrientSource);

registerGetByIdEndpoint(router, getPostgresFullFood);
registerGetByIdEndpoint(router, getPostgresFullFoodWithNutrients);
registerGetByIdEndpoint(router, getPostgresFullFoodWithFullNutrients);
