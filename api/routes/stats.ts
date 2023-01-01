import express, { Request, Response } from 'express';
import { handleGetStatsRequest } from '../handlers';
import {
  countFood,
  getFood,
  getFullFood,
  getFullFoodWithFullNeutrients,
  getFullFoodWithNeutrients,
} from '../queries/postgres';

const router = express.Router();

router.get(`/${getFood.name}Stats`, async (req: Request, res: Response) =>
  handleGetStatsRequest(req, res, getFood, countFood)
);

router.get(`/${getFullFood.name}Stats`, async (req: Request, res: Response) =>
  handleGetStatsRequest(req, res, getFullFood, countFood)
);

router.get(`/${getFullFoodWithNeutrients.name}Stats`, async (req: Request, res: Response) =>
  handleGetStatsRequest(req, res, getFullFoodWithNeutrients, countFood)
);

router.get(`/${getFullFoodWithFullNeutrients.name}Stats`, async (req: Request, res: Response) =>
  handleGetStatsRequest(req, res, getFullFoodWithFullNeutrients, countFood)
);

export { router };
