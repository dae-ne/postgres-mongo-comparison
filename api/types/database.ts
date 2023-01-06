import { Db } from 'mongodb';
import { Pool } from 'pg';
import { Quantity } from './models';

export type MongoDb = Db;

export type PostgresDb = Pool;

export type PostgresGetQueryMethodType = (
  db: PostgresDb,
  offset: number,
  limit: number,
  id: number | null
) => Promise<unknown[]>;

export type MongoGetQueryMethodType = (
  db: MongoDb,
  offset: number,
  limit: number,
  id: number | null
) => Promise<unknown[]>;

export type PostgresCountQueryMethodType = (db: PostgresDb) => Promise<Quantity>;

export type MongoCountQueryMethodType = (db: MongoDb) => Promise<Quantity>;
