import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { countBrandedFood, countFood, countFoodNutrient, countFoodNutrientDerivation, countFoodNutrientSource, countNutrient, getFood, getFullFood, getFullFoodWithFullNeutrients, getFullFoodWithNeutrients } from './queries/postgres';

dotenv.config();

const app = express();
// const port = process.env.PORT;
const port = 8000;

const handleGetStatsRequest = async (
  req: Request,
  res: Response,
  sqlQuery: (limit: number) => Promise<any[]>,
  //noSqlQuery: <T extends unknown>(limit: number) => T
) => {
  let executionTimes: number[] = [];
  const { count: numberOfRows } = await countFood();

  for (let i = 100000; i <= numberOfRows; i += 100000) {
    const start = Date.now();
    await sqlQuery(i);
    const elapsed = Date.now() - start;
    executionTimes.push(elapsed);
  }

  res.send(executionTimes);
};

app.get('/ping', (_: Request, res: Response) => {
  res.send('Hi!');
});

app.get('/countFood', async (_: Request, res: Response) => {
  const count = await countFood();
  res.json(count);
});
app.get('/countBrandedFood', async (_: Request, res: Response) => {
  const foodItemsCount = await countBrandedFood();
  res.json(foodItemsCount);
});
app.get('/countNutrient', async (_: Request, res: Response) => {
  const foodItemsCount = await countNutrient();
  res.json(foodItemsCount);
});
app.get('/countFoodNutrient', async (_: Request, res: Response) => {
  const foodItemsCount = await countFoodNutrient();
  res.json(foodItemsCount);
});
app.get('/countFoodNutrientDerivation', async (_: Request, res: Response) => {
  const foodItemsCount = await countFoodNutrientDerivation();
  res.json(foodItemsCount);
});
app.get('/countFoodNutrientSource', async (_: Request, res: Response) => {
  const foodItemsCount = await countFoodNutrientSource();
  res.json(foodItemsCount);
});

app.get('/getFood', async (_: Request, res: Response) => {
  const food = await getFood(1);
  res.json(food);
});
app.get('/getFullFood', async (_: Request, res: Response) => {
  const food = await getFullFood(1);
  res.json(food);
});
app.get('/getFullFoodWithNeutrients', async (_: Request, res: Response) => {
  const food = await getFullFoodWithNeutrients(1);
  res.json(food);
});
app.get('/getFullFoodWithFullNeutrients', async (_: Request, res: Response) => {
  const food = await getFullFoodWithFullNeutrients(1);
  res.json(food);
});

app.get(
  '/getFoodStats',
  async (req: Request, res: Response) => handleGetStatsRequest(req, res, getFood));
app.get(
  '/getFullFood',
  async (req: Request, res: Response) => handleGetStatsRequest(req, res, getFullFood));
app.get(
  '/getFullFoodWithNeutrients',
  async (req: Request, res: Response) => handleGetStatsRequest(req, res, getFullFoodWithNeutrients));
app.get(
  '/getFullFoodWithFullNeutrients',
  async (req: Request, res: Response) => handleGetStatsRequest(req, res, getFullFoodWithFullNeutrients));

app.listen(port, () => {
  console.log('⚡️ Server is running: \x1b[34m%s\x1b[0m', `http://localhost:${port}`);
});
