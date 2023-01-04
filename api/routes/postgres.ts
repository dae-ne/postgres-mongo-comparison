import express, { Request, Response } from 'express';
import { handlePostgresRequest } from '../handlers/requests';
import {
  countPostgresBrandedFood,
  countPostgresFood,
  countPostgresFoodNutrient,
  countPostgresFoodNutrientDerivation,
  countPostgresFoodNutrientSource,
  countPostgresNutrient,
  getPostgresFood,
  getPostgresFullFood,
  getPostgresFullFoodWithFullNutrients,
  getPostgresFullFoodWithNutrients
} from '../queries/postgres';

const router = express.Router();

// TODO: registerEndpoint method

router.get(`/${countPostgresFood.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countPostgresFood(db);
    res.json(count);
  });
});

router.get(`/${countPostgresBrandedFood.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countPostgresBrandedFood(db);
    res.json(count);
  });
});

router.get(`/${countPostgresNutrient.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countPostgresNutrient(db);
    res.json(count);
  });
});

router.get(`/${countPostgresFoodNutrient.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countPostgresFood(db);
    res.json(count);
  });
});

router.get(`/${countPostgresFoodNutrientDerivation.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countPostgresFoodNutrientDerivation(db);
    res.json(count);
  });
});

router.get(`/${countPostgresFoodNutrientSource.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const count = await countPostgresFoodNutrientSource(db);
    res.json(count);
  });
});

router.get(`/${getPostgresFood.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const data = await getPostgresFood(db, 1);
    res.json(data);
  });
});

router.get(`/${getPostgresFullFood.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const data = await getPostgresFullFood(db, 1);
    res.json(data);
  });
});

router.get(`/${getPostgresFullFoodWithNutrients.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const data = await getPostgresFullFoodWithNutrients(db, 1);
    res.json(data);
  });
});

router.get(`/${getPostgresFullFoodWithFullNutrients.name}`, async (req: Request, res: Response) => {
  await handlePostgresRequest(req, async (db) => {
    const data = await getPostgresFullFoodWithFullNutrients(db, 1);
    res.json(data);
  });
});

export { router };
