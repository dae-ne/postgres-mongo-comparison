import { logger } from '../../library/logging';
import { StatsDatasetDto } from '../../types/contracts';
import * as dbTypes from '../../types/database';
import { TestData, TestDataWithoutId } from '../../types/models';

export const handleSingleDatabase = async <TDb extends dbTypes.PostgresDb | dbTypes.MongoDb>(
  db: TDb,
  dbName: string,
  query: dbTypes.DbGetQueryMethodType<TDb>,
  countQuery: dbTypes.DbCountQueryMethodType<TDb>,
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

export const handleAddManyForSingleDatabase = async <
  TDb extends dbTypes.PostgresDb | dbTypes.MongoDb
>(
  db: TDb,
  query: dbTypes.DbAddQueryMethodType<TDb>,
  elements: number
) => {
  const data: TestData[] = [...Array(elements).keys()].map((e) => ({
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

export const handleUpdateAllForSingleDatabase = async <
  TDb extends dbTypes.PostgresDb | dbTypes.MongoDb
>(
  db: TDb,
  query: dbTypes.DbUpdateQueryMethodType<TDb>
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

export const handleDeleteAllForSingleDatabase = async <
  TDb extends dbTypes.PostgresDb | dbTypes.MongoDb
>(
  db: TDb,
  query: dbTypes.DbDeleteQueryMethodType<TDb>
) => {
  const start = Date.now();
  await query(db);
  const elapsed = Date.now() - start;
  return elapsed;
};
