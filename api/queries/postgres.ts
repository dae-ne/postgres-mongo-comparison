import { createPostgresDbPool } from '../config/db';
import { Quantity } from '../models/quantity';

type RowsNumber = Omit<Quantity, 'name'>;

const pool = createPostgresDbPool();

const countRows = async (tableName: string): Promise<Quantity> => {
  const query = `SELECT COUNT(*) FROM ${tableName}`;
  const { rows } = await pool.query<RowsNumber>(query);
  return {
    ...rows[0],
    name: tableName
  };
};

const getData = async (query: string, limit: number) => {
  const params = [limit];
  const { rows } = await pool.query(query, params);
  return rows;
};

export const countFood = async (): Promise<Quantity> => {
  const tableName = 'food';
  return countRows(tableName);
};

export const countBrandedFood = async (): Promise<Quantity> => {
  const tableName = 'branded_food';
  return countRows(tableName);
};

export const countNutrient = async (): Promise<Quantity> => {
  const tableName = 'nutrient';
  return countRows(tableName);
};

export const countFoodNutrient = async (): Promise<Quantity> => {
  const tableName = 'food_nutrient';
  return countRows(tableName);
};

export const countFoodNutrientDerivation = async (): Promise<Quantity> => {
  const tableName = 'food_nutrient_derivation';
  return countRows(tableName);
};

export const countFoodNutrientSource = async (): Promise<Quantity> => {
  const tableName = 'food_nutrient_source';
  return countRows(tableName);
};

export const getFood = async (limit: number) => {
  const query = 'SELECT * FROM food LIMIT $1';
  return getData(query, limit);
};

export const getFullFood = async (limit: number) => {
  const query = 'SELECT * FROM food JOIN branded_food USING (fdc_id) LIMIT $1';
  return getData(query, limit);
};

export const getFullFoodWithNeutrients = async (limit: number) => {
  const query =
    `SELECT
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
  return getData(query, limit);
};

export const getFullFoodWithFullNeutrients = async (limit: number) => {
  const query =
    `SELECT
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
  return getData(query, limit);
};
