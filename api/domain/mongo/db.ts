import { Db, MongoClient } from 'mongodb';
import { mongoConfig } from '../../config/db';

export type MongoDb = Db;

const { user, password, host, port, database } = mongoConfig;

const uri = `mongodb://${user}:${password}@${host}:${port}`;
const client = new MongoClient(uri);

export const connectToMongoDb = async (): Promise<MongoDb> => {
  await client.connect();
  const db = client.db(database);
  return db;
};

export const closeMongoDbConnection = () => client.close();
