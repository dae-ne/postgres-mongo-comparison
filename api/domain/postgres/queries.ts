import { countRows, createWhereIdClause, getData } from './queries.helpers';
import {
  PostgresAddQueryMethodType,
  PostgresCountQueryMethodType,
  PostgresDb,
  PostgresDeleteQueryMethodType,
  PostgresGetQueryMethodType,
  PostgresUpdateQueryMethodType
} from '../../types/database';
import { Quantity, TestData, TestDataWithoutId } from '../../types/models';

export const countPostgresFood: PostgresCountQueryMethodType = async (
  db: PostgresDb
): Promise<Quantity> => {
  const tableName = 'food';
  return countRows(db, tableName);
};

export const countPostgresBrandedFood: PostgresCountQueryMethodType = async (
  db: PostgresDb
): Promise<Quantity> => {
  const tableName = 'branded_food';
  return countRows(db, tableName);
};

export const countPostgresNutrient: PostgresCountQueryMethodType = async (
  db: PostgresDb
): Promise<Quantity> => {
  const tableName = 'nutrient';
  return countRows(db, tableName);
};

export const countPostgresFoodNutrient: PostgresCountQueryMethodType = async (
  db: PostgresDb
): Promise<Quantity> => {
  const tableName = 'food_nutrient';
  return countRows(db, tableName);
};

export const countPostgresFoodNutrientDerivation: PostgresCountQueryMethodType = async (
  db: PostgresDb
): Promise<Quantity> => {
  const tableName = 'food_nutrient_derivation';
  return countRows(db, tableName);
};

export const countPostgresFoodNutrientSource: PostgresCountQueryMethodType = async (
  db: PostgresDb
): Promise<Quantity> => {
  const tableName = 'food_nutrient_source';
  return countRows(db, tableName);
};

export const getPostgresFood: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food ${createWhereIdClause(id, 'fdc_id')} OFFSET $1 LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const getPostgresBrandedFood: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM branded_food ${createWhereIdClause(
    id,
    'fdc_id'
  )} OFFSET $1 LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const getPostgresNutrient: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM nutrient ${createWhereIdClause(id, 'id')} OFFSET $1 LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const getPostgresFoodNutrient: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food_nutrient ${createWhereIdClause(id, 'id')} OFFSET $1 LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const getPostgresFoodNutrientDerivation: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food_nutrient_derivation ${createWhereIdClause(
    id,
    'id'
  )} OFFSET $1 LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const getPostgresFoodNutrientSource: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food_nutrient_source ${createWhereIdClause(
    id,
    'id'
  )} OFFSET $1 LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const getPostgresFullFood: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food LEFT JOIN branded_food USING (fdc_id) ${createWhereIdClause(
    id,
    'fdc_id'
  )} OFFSET $1 LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const getPostgresFullFoodWithNutrients: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `
    SELECT
      f.*,
      bf.*,
      json_agg((
        SELECT x
        FROM (SELECT fnt.id, fnt.amount, fnt.derivation_id, fnt.nutrient) x
      )) food_nutrient
    FROM (
      SELECT
        fn.*,
        row_to_json(n) nutrient
      FROM food_nutrient fn
      LEFT JOIN nutrient n ON fn.nutrient_id = n.id
    ) fnt
    RIGHT JOIN food f USING (fdc_id)
    LEFT JOIN branded_food bf USING (fdc_id)
    ${createWhereIdClause(id, 'fdc_id')}
    GROUP BY f.fdc_id, bf.fdc_id
    OFFSET $1
    LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const getPostgresFullFoodWithFullNutrients: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `
    SELECT
      f.*,
      bf.*,
      json_agg((
        SELECT x
        FROM (SELECT fnt.id, fnt.amount, fnt.nutrient, fnt.food_nutrient_derivation) x
      )) food_nutrient
    FROM (
      SELECT
        fn.*,
        row_to_json(n) nutrient,
        row_to_json((
          SELECT x
          FROM (SELECT fndt.id, fndt.code, fndt.description, fndt.food_nutrient_source) x
        )) food_nutrient_derivation
      FROM (
        SELECT
          fnd.*,
          row_to_json(fns) food_nutrient_source
        FROM food_nutrient_derivation fnd
        LEFT JOIN food_nutrient_source fns ON fnd.source_id = fns.id
      ) fndt
      RIGHT JOIN food_nutrient fn ON fndt.id = fn.derivation_id
      LEFT JOIN nutrient n ON fn.nutrient_id = n.id
    ) fnt
    RIGHT JOIN food f USING (fdc_id)
    LEFT JOIN branded_food bf USING (fdc_id)
    ${createWhereIdClause(id, 'fdc_id')}
    GROUP BY f.fdc_id, bf.fdc_id
    OFFSET $1
    LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const countPostgresTest: PostgresCountQueryMethodType = async (
  db: PostgresDb
): Promise<Quantity> => {
  const tableName = 'test';
  return countRows(db, tableName);
};

export const getPostgresTest: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM test ${createWhereIdClause(id, 'id')} OFFSET $1 LIMIT $2;`;
  return getData(db, query, offset, limit);
};

export const addPostgresMany: PostgresAddQueryMethodType = async (
  db: PostgresDb,
  data: TestData[]
) => {
  const formattedData = data
    .map((d) => `('${d.id}','${d.first_col}','${d.second_col}','${d.third_col}','${d.fourth_col}')`)
    .join(',');
  const query = `
    INSERT INTO test (
      id,
      first_col,
      second_col,
      third_col,
      fourth_col
    )
    VALUES ${formattedData};`;
  await db.query(query);
};

export const updatePostgresAll: PostgresUpdateQueryMethodType = async (
  db: PostgresDb,
  data: TestDataWithoutId
) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { first_col, second_col, third_col, fourth_col } = data;
  const query = `
    UPDATE test
    SET first_col = '${first_col}',
        second_col = '${second_col}',
        third_col = '${third_col}',
        fourth_col = '${fourth_col}'
    WHERE id != 1;`;
  await db.query(query);
};

export const deletePostgresAll: PostgresDeleteQueryMethodType = async (db: PostgresDb) => {
  const query = `DELETE FROM test WHERE id != 1;`;
  await db.query(query);
};
