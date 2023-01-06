import { Request, Response } from 'express';
import { logger } from '../../utils/logging';
import { getStatsQueryStringParams, MONGO_NAME, POSTGRES_NAME } from '../../utils/query-strings';
import { MongoDb } from '../mongo/db';
import { PostgresDb } from '../postgres/db';

const handleSingleDatabase = async <TDb>(
  db: TDb,
  dbName: string,
  query: (db: TDb, page: number, size: number) => Promise<object[]>,
  countQuery: (db: TDb) => Promise<Quantity>,
  first: number,
  last: number,
  step: number
) => {
  const executionTimes: number[] = [];
  const { count: total } = await countQuery(db);
  const rangeTo = last > total ? total : last;

  for (let i = first; i <= rangeTo; i += step) {
    const start = Date.now();
    // eslint-disable-next-line no-await-in-loop
    await query(db, 1, i);
    const elapsed = Date.now() - start;
    executionTimes.push(elapsed);
    logger.stats(
      `db: ${dbName}, elements: ${i}/${rangeTo} (step: ${step}), execution time: ${elapsed} ms`
    );
  }

  const dataset: StatsDatasetDto = {
    name: dbName,
    times: executionTimes
  };

  return dataset;
};

export const handleGetStatsRequest = async (
  req: Request,
  res: Response,
  methodName: string,
  postgresQuery: (db: PostgresDb, page: number, size: number) => Promise<object[]>,
  mongoQuery: (db: MongoDb, page: number, size: number) => Promise<object[]>,
  postgresCountQuery: (db: PostgresDb) => Promise<Quantity>,
  mongoCountQuery: (db: MongoDb) => Promise<Quantity>
) => {
  const { postgresDb, mongoDb } = req.app.locals;
  const { first, last, step, db } = getStatsQueryStringParams(req.query);
  const datasets: StatsDatasetDto[] = [];

  const labels = Array.from(
    { length: Math.floor((last - first) / step) + 1 },
    (_, i) => first + i * step
  );

  if (db.includes(POSTGRES_NAME)) {
    const postgresDataset = await handleSingleDatabase(
      postgresDb,
      POSTGRES_NAME,
      postgresQuery,
      postgresCountQuery,
      first,
      last,
      step
    );
    datasets.push(postgresDataset);
  }

  if (db.includes(MONGO_NAME)) {
    const mongoDataset = await handleSingleDatabase(
      mongoDb,
      MONGO_NAME,
      mongoQuery,
      mongoCountQuery,
      first,
      last,
      step
    );
    datasets.push(mongoDataset);
  }

  const stats: StatsDto = {
    method_name: methodName,
    labels,
    datasets
  };

  res.json(stats);
};
