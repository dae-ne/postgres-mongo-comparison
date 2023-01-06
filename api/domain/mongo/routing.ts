import express, { NextFunction, Request, Response } from 'express';
import {
  handleMongoCountRequest,
  handleMongoGetByIdRequest,
  handleMongoGetRequest
} from './handlers';
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
import { PaginatedDto } from '../../types/contracts';
import { MongoCountQueryMethodType, MongoGetQueryMethodType } from '../../types/database';

export const router = express.Router();

const registerCountEndpoint = (method: MongoCountQueryMethodType) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleMongoCountRequest(req, async (db) => {
        const count = await method(db);
        res.json(count);
      });
    } catch (error) {
      next(error);
    }
  });
};

const registerGetEndpoint = (
  method: MongoGetQueryMethodType,
  countMethod: MongoCountQueryMethodType
) => {
  router.get(`/${method.name}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleMongoGetRequest(req, async (db, page, size) => {
        const skip = (page - 1) * size;
        const data = await method(db, skip, size, null);
        const { count: total } = await countMethod(db);

        const response: PaginatedDto = {
          count: data.length,
          page,
          total,
          data
        };

        res.json(response);
      });
    } catch (error) {
      next(error);
    }
  });
};

const registerGetByIdEndpoint = (method: MongoGetQueryMethodType) => {
  router.get(`/${method.name}/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handleMongoGetByIdRequest(req, async (db, page, size, id) => {
        const skip = (page - 1) * size;
        const data = await method(db, skip, size, id);
        res.json(data[0]);
      });
    } catch (error) {
      next(error);
    }
  });
};

registerCountEndpoint(countMongoFood);
registerCountEndpoint(countMongoBrandedFood);
registerCountEndpoint(countMongoNutrient);
registerCountEndpoint(countMongoFoodNutrient);
registerCountEndpoint(countMongoFoodNutrientDerivation);
registerCountEndpoint(countMongoFoodNutrientSource);

registerGetEndpoint(getMongoFood, countMongoFood);
registerGetEndpoint(getMongoBrandedFood, countMongoBrandedFood);
registerGetEndpoint(getMongoNutrient, countMongoNutrient);
registerGetEndpoint(getMongoFoodNutrient, countMongoFoodNutrient);
registerGetEndpoint(getMongoFoodNutrientDerivation, countMongoFoodNutrientDerivation);
registerGetEndpoint(getMongoFoodNutrientSource, countMongoFoodNutrientSource);

registerGetEndpoint(getMongoFullFood, countMongoFood);
registerGetEndpoint(getMongoFullFoodWithNutrients, countMongoFood);
registerGetEndpoint(getMongoFullFoodWithFullNutrients, countMongoFood);

registerGetByIdEndpoint(getMongoFood);
registerGetByIdEndpoint(getMongoBrandedFood);
registerGetByIdEndpoint(getMongoNutrient);
registerGetByIdEndpoint(getMongoFoodNutrient);
registerGetByIdEndpoint(getMongoFoodNutrientDerivation);
registerGetByIdEndpoint(getMongoFoodNutrientSource);

registerGetByIdEndpoint(getMongoFullFood);
registerGetByIdEndpoint(getMongoFullFoodWithNutrients);
registerGetByIdEndpoint(getMongoFullFoodWithFullNutrients);
