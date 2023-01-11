/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import * as helpers from './handlers.helpers';
import { MONGO_NAME, POSTGRES_NAME } from '../../config/constants';
import { logger } from '../../library/logging';
import { getStatsQueryStringParams } from '../../library/query-strings';
import { StatsDatasetDto, StatsDto } from '../../types/contracts';
import * as dbTypes from '../../types/database';

export const handleGetStatsRequest = async (
  req: Request,
  res: Response,
  methodName: string,
  postgresQuery: dbTypes.PostgresGetQueryMethodType,
  mongoQuery: dbTypes.MongoGetQueryMethodType,
  postgresCountQuery: dbTypes.PostgresCountQueryMethodType,
  mongoCountQuery: dbTypes.MongoCountQueryMethodType
) => {
  const { postgresDb, mongoDb } = req.app.locals;
  const { first, last, step, db } = getStatsQueryStringParams(req.query);
  const datasets: StatsDatasetDto[] = [];

  const labels = Array.from(
    { length: Math.floor((last - first) / step) + 1 },
    (_, i) => first + i * step
  );

  const handlers = [
    {
      name: POSTGRES_NAME,
      handle: (name: string) =>
        helpers.handleSingleDatabase(
          postgresDb,
          name,
          postgresQuery,
          postgresCountQuery,
          first,
          last,
          step
        )
    },
    {
      name: MONGO_NAME,
      handle: (name: string) =>
        helpers.handleSingleDatabase(mongoDb, name, mongoQuery, mongoCountQuery, first, last, step)
    }
  ];

  for (const handler of handlers) {
    if (db.includes(handler.name)) {
      const dataset = await handler.handle(handler.name);
      datasets.push(dataset);
    }
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
  postgresAddQuery: dbTypes.PostgresAddQueryMethodType,
  postgresUpdateQuery: dbTypes.PostgresUpdateQueryMethodType,
  postgresDeleteQuery: dbTypes.PostgresDeleteQueryMethodType,
  mongoAddQuery: dbTypes.MongoAddQueryMethodType,
  mongoUpdateQuery: dbTypes.MongoUpdateQueryMethodType,
  mongoDeleteQuery: dbTypes.MongoDeleteQueryMethodType
) => {
  const { postgresDb, mongoDb } = req.app.locals;
  const { first, last, step, db } = getStatsQueryStringParams(req.query);
  let datasets: StatsDatasetDto[] = [];

  const labels = Array.from(
    { length: Math.floor((last - first) / step) + 1 },
    (_, i) => first + i * step
  );

  const handlers = [
    {
      name: POSTGRES_NAME,
      handleInsertion: (element: number) =>
        helpers.handleAddManyForSingleDatabase(postgresDb, postgresAddQuery, element),
      handleUpdate: () => helpers.handleUpdateAllForSingleDatabase(postgresDb, postgresUpdateQuery),
      handleDeletion: () =>
        helpers.handleDeleteAllForSingleDatabase(postgresDb, postgresDeleteQuery),
      deleteAll: () => postgresDeleteQuery(postgresDb)
    },
    {
      name: MONGO_NAME,
      handleInsertion: (element: number) =>
        helpers.handleAddManyForSingleDatabase(mongoDb, mongoAddQuery, element),
      handleUpdate: () => helpers.handleUpdateAllForSingleDatabase(mongoDb, mongoUpdateQuery),
      handleDeletion: () => helpers.handleDeleteAllForSingleDatabase(mongoDb, mongoDeleteQuery),
      deleteAll: () => mongoDeleteQuery(mongoDb)
    }
  ];

  for (const handler of handlers) {
    await handler.deleteAll();

    if (db.includes(handler.name)) {
      const insertionTimes: number[] = [];
      const updateTimes: number[] = [];
      const deletionTimes: number[] = [];

      for (let i = first; i <= last; i += step) {
        const addTime = await handler.handleInsertion(i);

        logger.stats(
          `db: ${handler.name}, operation: add, elements: ${i}/${last} (step: ${step}), execution time: ${addTime} ms`
        );

        const updateTime = await handler.handleUpdate();

        logger.stats(
          `db: ${handler.name}, operation: update, elements: ${i}/${last} (step: ${step}), execution time: ${updateTime} ms`
        );

        const deleteTime = await handler.handleDeletion();

        logger.stats(
          `db: ${handler.name}, operation: delete, elements: ${i}/${last} (step: ${step}), execution time: ${deleteTime} ms`
        );

        insertionTimes.push(addTime);
        updateTimes.push(updateTime);
        deletionTimes.push(deleteTime);
      }

      const addDataset: StatsDatasetDto = {
        name: `${handler.name} - add`,
        times: insertionTimes
      };

      const updateDataset: StatsDatasetDto = {
        name: `${handler.name} - update`,
        times: updateTimes
      };

      const deleteDataset: StatsDatasetDto = {
        name: `${handler.name} - delete`,
        times: deletionTimes
      };

      datasets = [...datasets, addDataset, updateDataset, deleteDataset];
    }
  }

  const stats: StatsDto = {
    method_name: methodName,
    labels,
    datasets
  };

  res.json(stats);
};
