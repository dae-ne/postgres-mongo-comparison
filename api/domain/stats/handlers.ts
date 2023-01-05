import { Request, Response } from 'express';
import { Quantity } from '../models/Quantity';
import { MongoDb } from '../mongo/db';
import { PostgresDb } from '../postgres/db';

export const handleRequest = async (
  req: Request,
  callback: (postgres: PostgresDb, mongo: MongoDb) => Promise<void>
) => {
  const { postgresDb, mongoDb } = req.app.locals;
  await callback(postgresDb, mongoDb);
};

export const handleGetStatsRequest = async (
  req: Request,
  res: Response,
  sqlQuery: (db: PostgresDb, page: number, size: number) => Promise<object[]>,
  // noSqlQuery: <T extends unknown>(limit: number) => T,
  sqlCountQuery: (db: PostgresDb) => Promise<Quantity>
  // noSqlCountQuery: () => Promise<Count>
) => {
  // TODO: remove eslint-disable-next-line
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await handleRequest(req, async (postgres, mongo) => {
    const executionTimes: number[] = [];
    const { count: numberOfRows } = await sqlCountQuery(postgres);

    for (let i = 1; i <= numberOfRows; i += 100000) {
      const start = Date.now();
      // TODO: remove eslint-disable-next-line
      // eslint-disable-next-line no-await-in-loop
      await sqlQuery(postgres, 1, i);
      const elapsed = Date.now() - start;
      executionTimes.push(elapsed);
    }

    res.send(executionTimes);
  });
};
