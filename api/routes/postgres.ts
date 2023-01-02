import express, { Request, Response } from 'express';
import { handlePostgresRequest } from '../handlers/requests';
import {
  countBrandedFood,
  countFood,
  countFoodNutrient,
  countFoodNutrientDerivation,
  countFoodNutrientSource,
  countNutrient,
  getFood,
  getFullFood,
  getFullFoodWithFullNeutrients,
  getFullFoodWithNeutrients
} from '../queries/postgres';

const router = express.Router();

router.get(`/${countFood.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countFood(db);
    res.json(count);
  });
});

router.get(`/${countBrandedFood.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countBrandedFood(db);
    res.json(count);
  });
});

router.get(`/${countNutrient.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countNutrient(db);
    res.json(count);
  });
});

router.get(`/${countFoodNutrient.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countFood(db);
    res.json(count);
  });
});

router.get(`/${countFoodNutrientDerivation.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countFoodNutrientDerivation(db);
    res.json(count);
  });
});

router.get(`/${countFoodNutrientSource.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countFoodNutrientSource(db);
    res.json(count);
  });
});

router.get(`/${getFood.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const data = await getFood(db, 1);
    res.json(data);
  });
});

router.get(`/${getFullFood.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const data = await getFullFood(db, 1);
    res.json(data);
  });
});

router.get(`/${getFullFoodWithNeutrients.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const data = await getFullFoodWithNeutrients(db, 1);
    res.json(data);
  });
});

router.get(`/${getFullFoodWithFullNeutrients.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const data = await getFullFoodWithFullNeutrients(db, 1);
    res.json(data);
  });
});

export { router };
