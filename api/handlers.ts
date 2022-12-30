import { Request, Response } from 'express';
import { Quantity } from './models/quantity';

export const handleGetStatsRequest = async (
  req: Request,
  res: Response,
  sqlQuery: (limit: number) => Promise<any[]>,
  //noSqlQuery: <T extends unknown>(limit: number) => T,
  sqlCountQuery: () => Promise<Quantity>,
  // noSqlCountQuery: () => Promise<Count>
) => {
  let executionTimes: number[] = [];
  const { count: numberOfRows } = await sqlCountQuery();

  for (let i = 1; i <= numberOfRows; i += 100000) {
    const start = Date.now();
    await sqlQuery(i);
    const elapsed = Date.now() - start;
    executionTimes.push(elapsed);
  }

  res.send(executionTimes);
};
