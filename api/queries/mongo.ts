import { MongoDb } from '../connections/mongo';
import { Quantity } from '../models/Quantity';

export const countMongoFood = async (db: MongoDb): Promise<Quantity> => {
  const name = 'food';
  const count = await db.collection(name).countDocuments();
  return { count, name };
};

export const getMongoFood = async (db: MongoDb, limit: number) => {
  const collection = 'food';
  const cursor = db.collection(collection).find({}).limit(limit);
  const result = await cursor.toArray();
  return result;
};

export const getMongoFullFood = async (db: MongoDb, limit: number) => {
  const collection = 'food';
  const cursor = db
    .collection(collection)
    .aggregate([
      {
        $lookup: {
          from: 'branded_food',
          localField: 'fdc_id',
          foreignField: 'fdc_id',
          as: 'joined'
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$joined', 0] }, '$$ROOT'] } }
      },
      { $project: { joined: 0, _id: 0 } }
    ])
    .limit(limit);
  const result = await cursor.toArray();
  return result;
};

export const getMongoFullFoodWithNutrients = async (db: MongoDb, limit: number) => {
  const cursor = db
    .collection('food')
    .aggregate([
      {
        $lookup: {
          from: 'branded_food',
          localField: 'fdc_id',
          foreignField: 'fdc_id',
          as: 'branded_food'
        }
      },
      {
        $lookup: {
          from: 'food_nutrient',
          localField: 'fdc_id',
          foreignField: 'fdc_id',
          as: 'food_nutrient',
          pipeline: [
            {
              $lookup: {
                from: 'nutrient',
                localField: 'nutrient_id',
                foreignField: 'id',
                as: 'nutrient',
                pipeline: [{ $project: { _id: 0 } }]
              }
            },
            { $unwind: { path: '$nutrient', preserveNullAndEmptyArrays: true } },
            { $project: { _id: 0, fdc_id: 0, nutrient_id: 0 } }
          ]
        }
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: [{ $arrayElemAt: ['$branded_food', 0] }, '$$ROOT'] }
        }
      },
      { $project: { branded_food: 0, _id: 0 } }
    ])
    .limit(limit);
  const result = await cursor.toArray();
  return result;
};
