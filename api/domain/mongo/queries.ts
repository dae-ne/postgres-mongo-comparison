import { MongoDb } from './db';
import { Quantity } from '../models';

const countDocuments = async (db: MongoDb, collectionName: string): Promise<Quantity> => {
  const count = await db.collection(collectionName).countDocuments();
  return { name: collectionName, count };
};

const getDataFilteredByFdcId = async (
  db: MongoDb,
  collectionName: string,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collection = db.collection(collectionName);
  return id
    ? collection.find({ fdc_id: id }).skip(skip).limit(limit).toArray()
    : collection.find({}).skip(skip).limit(limit).toArray();
};

const getDataFilteredById = async (
  db: MongoDb,
  collectionName: string,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collection = db.collection(collectionName);
  return id
    ? collection.find({ id }).skip(skip).limit(limit).toArray()
    : collection.find({}).skip(skip).limit(limit).toArray();
};

export const countMongoFood = async (db: MongoDb): Promise<Quantity> => {
  const collectionName = 'food';
  return countDocuments(db, collectionName);
};

export const countMongoBrandedFood = async (db: MongoDb): Promise<Quantity> => {
  const collectionName = 'branded_food';
  return countDocuments(db, collectionName);
};

export const countMongoNutrient = async (db: MongoDb): Promise<Quantity> => {
  const collectionName = 'nutrient';
  return countDocuments(db, collectionName);
};

export const countMongoFoodNutrient = async (db: MongoDb): Promise<Quantity> => {
  const collectionName = 'food_nutrient';
  return countDocuments(db, collectionName);
};

export const countMongoFoodNutrientDerivation = async (db: MongoDb): Promise<Quantity> => {
  const collectionName = 'food_nutrient_derivation';
  return countDocuments(db, collectionName);
};

export const countMongoFoodNutrientSource = async (db: MongoDb): Promise<Quantity> => {
  const collectionName = 'food_nutrient_source';
  return countDocuments(db, collectionName);
};

export const getMongoFood = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'food';
  return getDataFilteredByFdcId(db, collectionName, skip, limit, id);
};

export const getMongoBrandedFood = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'branded_food';
  return getDataFilteredByFdcId(db, collectionName, skip, limit, id);
};

export const getMongoNutrient = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'nutrient';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const getMongoFoodNutrient = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'food_nutrient';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const getMongoFoodNutrientDerivation = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'food_nutrient_derivation';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const getMongoFoodNutrientSource = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'food_nutrient_source';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const getMongoFullFood = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'food';

  let aggregatePipeline: object[] = [
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
  ];

  if (id) {
    aggregatePipeline = [{ $match: { fdc_id: id } }, ...aggregatePipeline];
  }

  const cursor = db.collection(collectionName).aggregate(aggregatePipeline).skip(skip).limit(limit);
  return cursor.toArray();
};

export const getMongoFullFoodWithNutrients = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'food';

  let aggregatePipeline: object[] = [
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
  ];

  if (id) {
    aggregatePipeline = [{ $match: { fdc_id: id } }, ...aggregatePipeline];
  }

  const cursor = db.collection(collectionName).aggregate(aggregatePipeline).skip(skip).limit(limit);
  return cursor.toArray();
};

export const getMongoFullFoodWithFullNutrients = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | undefined = undefined
) => {
  const collectionName = 'food';

  let aggregatePipeline: object[] = [
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
          {
            $lookup: {
              from: 'food_nutrient_derivation',
              localField: 'derivation_id',
              foreignField: 'id',
              as: 'food_nutrient_derivation',
              pipeline: [
                {
                  $lookup: {
                    from: 'food_nutrient_source',
                    localField: 'source_id',
                    foreignField: 'id',
                    as: 'food_nutrient_source',
                    pipeline: [{ $project: { _id: 0 } }]
                  }
                },
                { $project: { _id: 0 } }
              ]
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
  ];

  if (id) {
    aggregatePipeline = [{ $match: { fdc_id: id } }, ...aggregatePipeline];
  }

  const cursor = db.collection(collectionName).aggregate(aggregatePipeline).skip(skip).limit(limit);
  return cursor.toArray();
};
