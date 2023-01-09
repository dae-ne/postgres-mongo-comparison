import { Db } from 'mongodb';
import { Pool } from 'pg';
import { Quantity } from './models';

export type MongoDb = Db;

export type PostgresDb = Pool;

export type DbGetQueryMethodType<TDb extends PostgresDb | MongoDb> = (
  db: TDb,
  offset: number,
  limit: number,
  id: number | null
) => Promise<unknown[]>;

export type DbCountQueryMethodType<TDb extends PostgresDb | MongoDb> = (
  db: TDb
) => Promise<Quantity>;

export type PostgresGetQueryMethodType = DbGetQueryMethodType<PostgresDb>;

export type MongoGetQueryMethodType = DbGetQueryMethodType<MongoDb>;

export type PostgresCountQueryMethodType = DbCountQueryMethodType<PostgresDb>;

export type MongoCountQueryMethodType = DbCountQueryMethodType<MongoDb>;
