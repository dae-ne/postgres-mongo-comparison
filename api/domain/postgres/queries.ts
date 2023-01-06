import {
  PostgresCountQueryMethodType,
  PostgresDb,
  PostgresGetQueryMethodType
} from '../../types/database';
import { Quantity } from '../../types/models';

type RowsNumber = Omit<Quantity, 'name'>;

const createWhereFdcIdClause = (id: number | null) => (id ? `WHERE fdc_id = ${id}` : '');

const createWhereIdClause = (id: number | null) => (id ? `WHERE id = ${id}` : '');

const countRows = async (db: PostgresDb, tableName: string): Promise<Quantity> => {
  const query = `SELECT COUNT(*) FROM ${tableName}`;
  const { rows } = await db.query<RowsNumber>(query);
  return {
    name: tableName,
    count: +rows[0].count
  };
};

const getData = async (db: PostgresDb, query: string, offset: number, limit: number) => {
  const params = [offset, limit];
  const { rows } = await db.query(query, params);
  return rows;
};

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
  const query = `SELECT * FROM food ${createWhereFdcIdClause(id)} OFFSET $1 LIMIT $2`;
  return getData(db, query, offset, limit);
};

export const getPostgresBrandedFood: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM branded_food ${createWhereFdcIdClause(id)} OFFSET $1 LIMIT $2`;
  return getData(db, query, offset, limit);
};

export const getPostgresNutrient: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM nutrient ${createWhereIdClause(id)} OFFSET $1 LIMIT $2`;
  return getData(db, query, offset, limit);
};

export const getPostgresFoodNutrient: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food_nutrient ${createWhereIdClause(id)} OFFSET $1 LIMIT $2`;
  return getData(db, query, offset, limit);
};

export const getPostgresFoodNutrientDerivation: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food_nutrient_derivation ${createWhereIdClause(
    id
  )} OFFSET $1 LIMIT $2`;
  return getData(db, query, offset, limit);
};

export const getPostgresFoodNutrientSource: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food_nutrient_source ${createWhereIdClause(id)} OFFSET $1 LIMIT $2`;
  return getData(db, query, offset, limit);
};

export const getPostgresFullFood: PostgresGetQueryMethodType = async (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null = null
) => {
  const query = `SELECT * FROM food JOIN branded_food USING (fdc_id) ${createWhereFdcIdClause(
    id
  )} OFFSET $1 LIMIT $2`;
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
    ${createWhereFdcIdClause(id)}
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
    ${createWhereFdcIdClause(id)}
    GROUP BY f.fdc_id, bf.fdc_id
    OFFSET $1
    LIMIT $2;`;
  return getData(db, query, offset, limit);
};
