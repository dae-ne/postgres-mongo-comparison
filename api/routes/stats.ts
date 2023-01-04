import express, { Request, Response } from 'express';
import { handleGetStatsRequest } from '../handlers/requests';
import {
  countPostgresFood,
  getPostgresFood,
  getPostgresFullFood,
  getPostgresFullFoodWithFullNutrients,
  getPostgresFullFoodWithNutrients
} from '../queries/postgres';

const router = express.Router();

router.get(`/${getPostgresFood.name}Stats`, async (req: Request, res: Response) =>
  handleGetStatsRequest(req, res, getPostgresFood, countPostgresFood)
);

router.get(`/${getPostgresFullFood.name}Stats`, async (req: Request, res: Response) =>
  handleGetStatsRequest(req, res, getPostgresFullFood, countPostgresFood)
);

router.get(`/${getPostgresFullFoodWithNutrients.name}Stats`, async (req: Request, res: Response) =>
  handleGetStatsRequest(req, res, getPostgresFullFoodWithNutrients, countPostgresFood)
);

router.get(
  `/${getPostgresFullFoodWithFullNutrients.name}Stats`,
  async (req: Request, res: Response) =>
    handleGetStatsRequest(req, res, getPostgresFullFoodWithFullNutrients, countPostgresFood)
);

export { router };
