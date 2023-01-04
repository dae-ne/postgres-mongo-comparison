import express, { Request, Response } from 'express';
import { handleMongoRequest } from '../handlers/requests';
import {
  countMongoFood,
  getMongoFood,
  getMongoFullFood,
  getMongoFullFoodWithNutrients
} from '../queries/mongo';

const router = express.Router();

// TODO: registerEndpoint method

router.get(`/${countMongoFood.name}`, async (req: Request, res: Response) => {
  await handleMongoRequest(req, async (db) => {
    const count = await countMongoFood(db);
    res.json(count);
  });
});

router.get(`/${getMongoFood.name}`, async (req: Request, res: Response) => {
  await handleMongoRequest(req, async (db) => {
    const count = await getMongoFood(db, 1);
    res.json(count);
  });
});

router.get(`/${getMongoFullFood.name}`, async (req: Request, res: Response) => {
  await handleMongoRequest(req, async (db) => {
    const count = await getMongoFullFood(db, 1);
    res.json(count);
  });
});

router.get(`/${getMongoFullFoodWithNutrients.name}`, async (req: Request, res: Response) => {
  await handleMongoRequest(req, async (db) => {
    const count = await getMongoFullFoodWithNutrients(db, 1);
    res.json(count);
  });
});

export { router };
