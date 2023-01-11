/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import { MONGO_NAME, POSTGRES_NAME } from '../../config/constants';
import { logger } from '../../library/logging';
import { getStatsQueryStringParams } from '../../library/query-strings';
import { StatsDatasetDto, StatsDto } from '../../types/contracts';
import {
  DbAddQueryMethodType,
  DbCountQueryMethodType,
  DbDeleteQueryMethodType,
  DbGetQueryMethodType,
  DbUpdateQueryMethodType,
  MongoAddQueryMethodType,
  MongoCountQueryMethodType,
  MongoDb,
  MongoDeleteQueryMethodType,
  MongoGetQueryMethodType,
  MongoUpdateQueryMethodType,
  PostgresAddQueryMethodType,
  PostgresCountQueryMethodType,
  PostgresDb,
  PostgresDeleteQueryMethodType,
  PostgresGetQueryMethodType,
  PostgresUpdateQueryMethodType
} from '../../types/database';
import { TestData, TestDataWithoutId } from '../../types/models';

const handleSingleDatabase = async <TDb extends PostgresDb | MongoDb>(
  db: TDb,
  dbName: string,
  query: DbGetQueryMethodType<TDb>,
  countQuery: DbCountQueryMethodType<TDb>,
  first: number,
  last: number,
  step: number
) => {
  const executionTimes: number[] = [];
  const { count: total } = await countQuery(db);
  const rangeTo = last > total ? total : last;

  for (let i = first; i <= rangeTo; i += step) {
    const start = Date.now();
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

const handleAddManyForSingleDatabase = async <TDb extends PostgresDb | MongoDb>(
  db: TDb,
  query: DbAddQueryMethodType<TDb>,
  x: number
) => {
  const data: TestData[] = [...Array(x).keys()].map((e) => ({
    id: e + 2,
    first_col: 'default_value_1',
    second_col: 'default_value_2',
    third_col: 'default_value_3',
    fourth_col: 'default_value_4'
  }));

  const start = Date.now();
  await query(db, data);
  const elapsed = Date.now() - start;
  return elapsed;
};

const handleUpdateAllForSingleDatabase = async <TDb extends PostgresDb | MongoDb>(
  db: TDb,
  query: DbUpdateQueryMethodType<TDb>
) => {
  const data: TestDataWithoutId = {
    first_col: 'updated_value_1',
    second_col: 'updated_value_2',
    third_col: 'updated_value_3',
    fourth_col: 'updated_value_4'
  };

  const start = Date.now();
  await query(db, data);
  const elapsed = Date.now() - start;
  return elapsed;
};

const handleDeleteAllForSingleDatabase = async <TDb extends PostgresDb | MongoDb>(
  db: TDb,
  query: DbDeleteQueryMethodType<TDb>
) => {
  const start = Date.now();
  await query(db);
  const elapsed = Date.now() - start;
  return elapsed;
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

export const handleAddUpdateDeleteStatsRequest = async (
  req: Request,
  res: Response,
  methodName: string,
  postgresAddQuery: PostgresAddQueryMethodType,
  postgresUpdateQuery: PostgresUpdateQueryMethodType,
  postgresDeleteQuery: PostgresDeleteQueryMethodType,
  mongoAddQuery: MongoAddQueryMethodType,
  mongoUpdateQuery: MongoUpdateQueryMethodType,
  mongoDeleteQuery: MongoDeleteQueryMethodType
) => {
  const { postgresDb, mongoDb } = req.app.locals;
  const { first, last, step, db } = getStatsQueryStringParams(req.query);
  let datasets: StatsDatasetDto[] = [];

  const labels = Array.from(
    { length: Math.floor((last - first) / step) + 1 },
    (_, i) => first + i * step
  );

  await postgresDeleteQuery(postgresDb);

  if (db.includes(POSTGRES_NAME)) {
    const postgresAddTimes: number[] = [];
    const postgresUpdateTimes: number[] = [];
    const postgresDeleteTimes: number[] = [];

    for (let i = first; i <= last; i += step) {
      const addTime = await handleAddManyForSingleDatabase(postgresDb, postgresAddQuery, i);

      logger.stats(
        `db: ${POSTGRES_NAME}, operation: add, elements: ${i}/${last} (step: ${step}), execution time: ${addTime} ms`
      );

      const updateTime = await handleUpdateAllForSingleDatabase(postgresDb, postgresUpdateQuery);

      logger.stats(
        `db: ${POSTGRES_NAME}, operation: update, elements: ${i}/${last} (step: ${step}), execution time: ${updateTime} ms`
      );

      const deleteTime = await handleDeleteAllForSingleDatabase(postgresDb, postgresDeleteQuery);

      logger.stats(
        `db: ${POSTGRES_NAME}, operation: delete, elements: ${i}/${last} (step: ${step}), execution time: ${deleteTime} ms`
      );

      postgresAddTimes.push(addTime);
      postgresUpdateTimes.push(updateTime);
      postgresDeleteTimes.push(deleteTime);
    }

    const addDataset: StatsDatasetDto = {
      name: `${POSTGRES_NAME} - add`,
      times: postgresAddTimes
    };

    const updateDataset: StatsDatasetDto = {
      name: `${POSTGRES_NAME} - update`,
      times: postgresUpdateTimes
    };

    const deleteDataset: StatsDatasetDto = {
      name: `${POSTGRES_NAME} - delete`,
      times: postgresDeleteTimes
    };

    datasets = [...datasets, addDataset, updateDataset, deleteDataset];
  }

  await mongoDeleteQuery(mongoDb);

  if (db.includes(MONGO_NAME)) {
    const mongoAddTimes: number[] = [];
    const mongoUpdateTimes: number[] = [];
    const mongoDeleteTimes: number[] = [];

    for (let i = first; i <= last; i += step) {
      const addTime = await handleAddManyForSingleDatabase(mongoDb, mongoAddQuery, i);

      logger.stats(
        `db: ${MONGO_NAME}, operation: add, elements: ${i}/${last} (step: ${step}), execution time: ${addTime} ms`
      );

      const updateTime = await handleUpdateAllForSingleDatabase(mongoDb, mongoUpdateQuery);

      logger.stats(
        `db: ${MONGO_NAME}, operation: update, elements: ${i}/${last} (step: ${step}), execution time: ${updateTime} ms`
      );

      const deleteTime = await handleDeleteAllForSingleDatabase(mongoDb, mongoDeleteQuery);

      logger.stats(
        `db: ${MONGO_NAME}, operation: delete, elements: ${i}/${last} (step: ${step}), execution time: ${deleteTime} ms`
      );

      mongoAddTimes.push(addTime);
      mongoUpdateTimes.push(updateTime);
      mongoDeleteTimes.push(deleteTime);
    }

    const addDataset: StatsDatasetDto = {
      name: `${MONGO_NAME} - add`,
      times: mongoAddTimes
    };

    const updateDataset: StatsDatasetDto = {
      name: `${MONGO_NAME} - update`,
      times: mongoUpdateTimes
    };

    const deleteDataset: StatsDatasetDto = {
      name: `${MONGO_NAME} - delete`,
      times: mongoDeleteTimes
    };

    datasets = [...datasets, addDataset, updateDataset, deleteDataset];
  }

  const stats: StatsDto = {
    method_name: methodName,
    labels,
    datasets
  };

  res.json(stats);
};
