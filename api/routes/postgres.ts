import express, { Request, Response } from 'express';
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
  getFullFoodWithNeutrients,
} from '../queries/postgres';

const router = express.Router();

router.get(`/${countFood.name}`, async (_: Request, res: Response) => {
  const count = await countFood();
  res.json(count);
});

router.get(`/${countBrandedFood.name}`, async (_: Request, res: Response) => {
  const count = await countBrandedFood();
  res.json(count);
});

router.get(`/${countNutrient.name}`, async (_: Request, res: Response) => {
  const count = await countNutrient();
  res.json(count);
});

router.get(`/${countFoodNutrient.name}`, async (_: Request, res: Response) => {
  const count = await countFoodNutrient();
  res.json(count);
});

router.get(`/${countFoodNutrientDerivation.name}`, async (_: Request, res: Response) => {
  const count = await countFoodNutrientDerivation();
  res.json(count);
});

router.get(`/${countFoodNutrientSource.name}`, async (_: Request, res: Response) => {
  const count = await countFoodNutrientSource();
  res.json(count);
});

router.get(`/${getFood.name}`, async (_: Request, res: Response) => {
  const data = await getFood(1);
  res.json(data);
});

router.get(`/${getFullFood.name}`, async (_: Request, res: Response) => {
  const data = await getFullFood(1);
  res.json(data);
});

router.get(`/${getFullFoodWithNeutrients.name}`, async (_: Request, res: Response) => {
  const data = await getFullFoodWithNeutrients(1);
  res.json(data);
});

router.get(`/${getFullFoodWithFullNeutrients.name}`, async (_: Request, res: Response) => {
  const data = await getFullFoodWithFullNeutrients(1);
  res.json(data);
});

export { router };
