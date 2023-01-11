import { MongoDb } from '../../types/database';
import { Quantity } from '../../types/models';

export const countDocuments = async (db: MongoDb, collectionName: string): Promise<Quantity> => {
  const count = await db.collection(collectionName).countDocuments();
  return { name: collectionName, count };
};

export const getDataFilteredByFdcId = async (
  db: MongoDb,
  collectionName: string,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collection = db.collection(collectionName);
  return id
    ? collection.find({ fdc_id: id }).project({ _id: 0 }).skip(skip).limit(limit).toArray()
    : collection.find({}).project({ _id: 0 }).skip(skip).limit(limit).toArray();
};

export const getDataFilteredById = async (
  db: MongoDb,
  collectionName: string,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collection = db.collection(collectionName);
  return id
    ? collection.find({ id }).project({ _id: 0 }).skip(skip).limit(limit).toArray()
    : collection.find({}).project({ _id: 0 }).skip(skip).limit(limit).toArray();
};
