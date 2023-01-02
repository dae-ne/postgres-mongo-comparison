import { Request, Response } from 'express';
import { MongoDb } from '../connections/mongo';
import { PostgresDb } from '../connections/postgres';
import { Quantity } from '../models/Quantity';

export const handleRequest = async (
  req: Request,
  callback: (postgres: PostgresDb, mongo: MongoDb) => Promise<void>
) => {
  const { postgresDb, mongoDb } = req.app.locals;
  await callback(postgresDb, mongoDb);
};

export const handlePostgresRequest = async (
  req: Request,
  callback: (postgres: PostgresDb) => Promise<void>
) => {
  const { postgresDb } = req.app.locals;
  await callback(postgresDb);
};

export const handleMongoRequest = async (
  req: Request,
  callback: (mongo: MongoDb) => Promise<void>
) => {
  const { mongoDb } = req.app.locals;
  await callback(mongoDb);
};

export const handleGetStatsRequest = async (
  req: Request,
  res: Response,
  sqlQuery: (db: PostgresDb, limit: number) => Promise<object[]>,
  // noSqlQuery: <T extends unknown>(limit: number) => T,
  sqlCountQuery: (db: PostgresDb) => Promise<Quantity>
  // noSqlCountQuery: () => Promise<Count>
) => {
  await handleRequest(req, async (postgres, mongo) => {
    const executionTimes: number[] = [];
    const { count: numberOfRows } = await sqlCountQuery(postgres);

    for (let i = 1; i <= numberOfRows; i += 100000) {
      const start = Date.now();
      await sqlQuery(postgres, i);
      const elapsed = Date.now() - start;
      executionTimes.push(elapsed);
    }

    res.send(executionTimes);
  });
};
