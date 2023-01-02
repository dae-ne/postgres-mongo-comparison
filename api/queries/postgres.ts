import { PostgresDb } from '../connections/postgres';
import { Quantity } from '../models/Quantity';

type RowsNumber = Omit<Quantity, 'name'>;

const countRows = async (db: PostgresDb, tableName: string): Promise<Quantity> => {
  const query = `SELECT COUNT(*) FROM ${tableName}`;
  const { rows } = await db.query<RowsNumber>(query);
  return {
    ...rows[0],
    name: tableName
  };
};

const getData = async (db: PostgresDb, query: string, limit: number) => {
  const params = [limit];
  const { rows } = await db.query(query, params);
  return rows;
};

export const countFood = async (db: PostgresDb): Promise<Quantity> => {
  const tableName = 'food';
  return countRows(db, tableName);
};

export const countBrandedFood = async (db: PostgresDb): Promise<Quantity> => {
  const tableName = 'branded_food';
  return countRows(db, tableName);
};

export const countNutrient = async (db: PostgresDb): Promise<Quantity> => {
  const tableName = 'nutrient';
  return countRows(db, tableName);
};

export const countFoodNutrient = async (db: PostgresDb): Promise<Quantity> => {
  const tableName = 'food_nutrient';
  return countRows(db, tableName);
};

export const countFoodNutrientDerivation = async (db: PostgresDb): Promise<Quantity> => {
  const tableName = 'food_nutrient_derivation';
  return countRows(db, tableName);
};

export const countFoodNutrientSource = async (db: PostgresDb): Promise<Quantity> => {
  const tableName = 'food_nutrient_source';
  return countRows(db, tableName);
};

export const getFood = async (db: PostgresDb, limit: number) => {
  const query = 'SELECT * FROM food LIMIT $1';
  return getData(db, query, limit);
};

export const getFullFood = async (db: PostgresDb, limit: number) => {
  const query = 'SELECT * FROM food JOIN branded_food USING (fdc_id) LIMIT $1';
  return getData(db, query, limit);
};

export const getFullFoodWithNeutrients = async (db: PostgresDb, limit: number) => {
  const query = `SELECT
      f.*,
      bf.*,
      json_agg(fnt) food_nutrient
    FROM (
      SELECT
        fn.*,
        row_to_json(n) nutrient
      FROM food_nutrient fn
      LEFT JOIN nutrient n ON fn.nutrient_id = n.id
    ) fnt
    RIGHT JOIN food f USING (fdc_id)
    LEFT JOIN branded_food bf USING (fdc_id)
    GROUP BY f.fdc_id, bf.fdc_id
    LIMIT $1;`;
  return getData(db, query, limit);
};

export const getFullFoodWithFullNeutrients = async (db: PostgresDb, limit: number) => {
  const query = `SELECT
      f.*,
      bf.*,
      json_agg(fnt) food_nutrient
    FROM (
      SELECT
          fn.*,
          row_to_json(n) nutrient,
          row_to_json(fndt) food_nutrient_derivation
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
    GROUP BY f.fdc_id, bf.fdc_id
    LIMIT $1;`;
  return getData(db, query, limit);
};
