import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { router as postgresRouter } from './routes/postgres';
import { router as mongoRouter } from './routes/mongo';
import { router as statsRouter } from './routes/stats';

dotenv.config();

const app = express();
// const port = process.env.PORT;
const port = 8000;

app.get('/ping', (_: Request, res: Response) => {
  res.send('Hi!');
});

//app.use(express.json());

app.use('/', statsRouter);
app.use('/postgres', postgresRouter);
app.use('/mongo', mongoRouter);

app.listen(port, () => {
  console.log('⚡️ Server is running: \x1b[34m%s\x1b[0m', `http://localhost:${port}`);
});
