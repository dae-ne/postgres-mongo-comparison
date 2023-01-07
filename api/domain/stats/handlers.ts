import { Request, Response } from 'express';
import { MONGO_NAME, POSTGRES_NAME } from '../../config/constants';
import { logger } from '../../library/logging';
import { getStatsQueryStringParams } from '../../library/query-strings';
import { StatsDatasetDto, StatsDto } from '../../types/contracts';
import {
  MongoCountQueryMethodType,
  MongoDb,
  MongoGetQueryMethodType,
  PostgresCountQueryMethodType,
  PostgresDb,
  PostgresGetQueryMethodType
} from '../../types/database';

// TODO: fix types in parameters
const handleSingleDatabase = async (
  db: PostgresDb & MongoDb,
  dbName: string,
  query: PostgresGetQueryMethodType | MongoGetQueryMethodType,
  countQuery: PostgresCountQueryMethodType | MongoCountQueryMethodType,
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
    await query(db, 0, i, null);
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
  postgresQuery: PostgresGetQueryMethodType,
  mongoQuery: MongoGetQueryMethodType,
  postgresCountQuery: PostgresCountQueryMethodType,
  mongoCountQuery: MongoCountQueryMethodType
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
