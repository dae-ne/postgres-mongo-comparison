import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fdc',
  password: 'postgres',
  port: 5432,
});

export const getFood = (_: Request, response: Response) => {
  pool.query('SELECT * FROM food LIMIT 10', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
