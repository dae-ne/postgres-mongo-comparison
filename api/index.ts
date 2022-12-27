import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getFood } from './pghandlers';

dotenv.config();

const app = express();
// const port = process.env.PORT;
const port = 8000;

app.get('/ping', (_: Request, res: Response) => {
  res.send('Hi!');
});

app.get('/get-food', getFood);

app.listen(port, () => {
  console.log('⚡️ Server is running: \x1b[34m%s\x1b[0m', `https://localhost:${port}`);
});
