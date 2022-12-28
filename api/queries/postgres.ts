import { Pool } from 'pg';
import { Count } from '../models/Count';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fdc',
  password: 'postgres',
  port: 5432,
});

const countRows = async (tableName: string): Promise<Count> => {
  const query = `SELECT COUNT(*) FROM ${tableName}`;
  const { rows } = await pool.query<Count>(query);
  return rows[0];
};

export const countFood = async (): Promise<Count> => {
  const tableName = 'food';
  const result: Count = {
    name: tableName,
    ...await countRows(tableName)
  }
  return result;
};

export const countBrandedFood = async (): Promise<Count> => {
  const tableName = 'branded_food';
  const result: Count = {
    name: tableName,
    ...await countRows(tableName)
  }
  return result;
};

export const countNutrient = async (): Promise<Count> => {
  const tableName = 'nutrient';
  const result: Count = {
    name: tableName,
    ...await countRows(tableName)
  }
  return result;
};

export const countFoodNutrient = async (): Promise<Count> => {
  const tableName = 'food_nutrient';
  const result: Count = {
    name: tableName,
    ...await countRows(tableName)
  }
  return result;
};

export const countFoodNutrientDerivation = async (): Promise<Count> => {
  const tableName = 'food_nutrient_derivation';
  const result: Count = {
    name: tableName,
    ...await countRows(tableName)
  }
  return result;
};

export const countFoodNutrientSource = async (): Promise<Count> => {
  const tableName = 'food_nutrient_source';
  const result: Count = {
    name: tableName,
    ...await countRows(tableName)
  }
  return result;
};

export const getFood = async (limit: number) => {
  const query = 'SELECT * FROM food LIMIT $1';
  const params = [limit];
  const { rows } = await pool.query(query, params);
  return rows;
};

export const getFullFood = async (limit: number) => {
  const query = 'SELECT * FROM food JOIN branded_food USING (fdc_id) LIMIT $1';
  const params = [limit];
  const { rows } = await pool.query(query, params);
  return rows;
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
    LIMIT $1;
    `;
  const params = [limit];
  const { rows } = await pool.query(query, params);
  return rows;
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
    LIMIT $1;
    `;
  const params = [limit];
  const { rows } = await pool.query(query, params);
  return rows;
};
