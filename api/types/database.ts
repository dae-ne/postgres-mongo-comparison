import { Db } from 'mongodb';
import { Pool } from 'pg';
import { Quantity, TestData, TestDataWithoutId } from './models';

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

export type DbAddQueryMethodType<TDb extends PostgresDb | MongoDb> = (
  db: TDb,
  data: TestData[]
) => Promise<void>;

export type DbUpdateQueryMethodType<TDb extends PostgresDb | MongoDb> = (
  db: TDb,
  data: TestDataWithoutId
) => Promise<void>;

export type DbDeleteQueryMethodType<TDb extends PostgresDb | MongoDb> = (db: TDb) => Promise<void>;

export type PostgresGetQueryMethodType = DbGetQueryMethodType<PostgresDb>;

export type PostgresCountQueryMethodType = DbCountQueryMethodType<PostgresDb>;

export type PostgresAddQueryMethodType = DbAddQueryMethodType<PostgresDb>;

export type PostgresUpdateQueryMethodType = DbUpdateQueryMethodType<PostgresDb>;

export type PostgresDeleteQueryMethodType = DbDeleteQueryMethodType<PostgresDb>;

export type MongoGetQueryMethodType = DbGetQueryMethodType<MongoDb>;

export type MongoCountQueryMethodType = DbCountQueryMethodType<MongoDb>;

export type MongoAddQueryMethodType = DbAddQueryMethodType<MongoDb>;

export type MongoUpdateQueryMethodType = DbUpdateQueryMethodType<MongoDb>;

export type MongoDeleteQueryMethodType = DbDeleteQueryMethodType<MongoDb>;
