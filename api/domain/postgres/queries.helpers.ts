import { PostgresDb } from '../../types/database';
import { Quantity } from '../../types/models';

type RowsNumber = Omit<Quantity, 'name'>;

export const createWhereIdClause = (id: number | null, fieldName: string) =>
  id ? `WHERE ${fieldName} = ${id}` : '';

export const countRows = async (db: PostgresDb, tableName: string): Promise<Quantity> => {
  const query = `SELECT COUNT(*) FROM ${tableName}`;
  const { rows } = await db.query<RowsNumber>(query);
  return {
    name: tableName,
    count: +rows[0].count
  };
};

export const getData = async (db: PostgresDb, query: string, offset: number, limit: number) => {
  const params = [offset, limit];
  const { rows } = await db.query(query, params);
  return rows;
};
