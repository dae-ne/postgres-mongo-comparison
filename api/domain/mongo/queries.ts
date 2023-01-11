import { countDocuments, getDataFilteredByFdcId, getDataFilteredById } from './queries.helpers';
import {
  MongoAddQueryMethodType,
  MongoCountQueryMethodType,
  MongoDb,
  MongoDeleteQueryMethodType,
  MongoGetQueryMethodType,
  MongoUpdateQueryMethodType
} from '../../types/database';
import { Quantity, TestData, TestDataWithoutId } from '../../types/models';

export const countMongoFood: MongoCountQueryMethodType = async (db: MongoDb): Promise<Quantity> => {
  const collectionName = 'food';
  return countDocuments(db, collectionName);
};

export const countMongoBrandedFood: MongoCountQueryMethodType = async (
  db: MongoDb
): Promise<Quantity> => {
  const collectionName = 'branded_food';
  return countDocuments(db, collectionName);
};

export const countMongoNutrient: MongoCountQueryMethodType = async (
  db: MongoDb
): Promise<Quantity> => {
  const collectionName = 'nutrient';
  return countDocuments(db, collectionName);
};

export const countMongoFoodNutrient: MongoCountQueryMethodType = async (
  db: MongoDb
): Promise<Quantity> => {
  const collectionName = 'food_nutrient';
  return countDocuments(db, collectionName);
};

export const countMongoFoodNutrientDerivation: MongoCountQueryMethodType = async (
  db: MongoDb
): Promise<Quantity> => {
  const collectionName = 'food_nutrient_derivation';
  return countDocuments(db, collectionName);
};

export const countMongoFoodNutrientSource: MongoCountQueryMethodType = async (
  db: MongoDb
): Promise<Quantity> => {
  const collectionName = 'food_nutrient_source';
  return countDocuments(db, collectionName);
};

export const getMongoFood: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'food';
  return getDataFilteredByFdcId(db, collectionName, skip, limit, id);
};

export const getMongoBrandedFood: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'branded_food';
  return getDataFilteredByFdcId(db, collectionName, skip, limit, id);
};

export const getMongoNutrient: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'nutrient';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const getMongoFoodNutrient: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'food_nutrient';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const getMongoFoodNutrientDerivation: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'food_nutrient_derivation';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const getMongoFoodNutrientSource: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'food_nutrient_source';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const getMongoFullFood: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'food';

  let aggregatePipeline: object[] = [
    { $skip: skip },
    { $limit: limit },
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

  return db.collection(collectionName).aggregate(aggregatePipeline).toArray();
};

export const getMongoFullFoodWithNutrients: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'food';

  let aggregatePipeline: object[] = [
    { $skip: skip },
    { $limit: limit },
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

  return db.collection(collectionName).aggregate(aggregatePipeline).toArray();
};

export const getMongoFullFoodWithFullNutrients: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'food';

  let aggregatePipeline: object[] = [
    { $skip: skip },
    { $limit: limit },
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
                { $unwind: { path: '$food_nutrient_source', preserveNullAndEmptyArrays: true } },
                { $project: { _id: 0, source_id: 0 } }
              ]
            }
          },
          { $unwind: { path: '$nutrient', preserveNullAndEmptyArrays: true } },
          { $unwind: { path: '$food_nutrient_derivation', preserveNullAndEmptyArrays: true } },
          { $project: { _id: 0, fdc_id: 0, nutrient_id: 0, derivation_id: 0 } }
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

  return db.collection(collectionName).aggregate(aggregatePipeline).toArray();
};

export const countMongoTest: MongoCountQueryMethodType = async (db: MongoDb): Promise<Quantity> => {
  const collectionName = 'test';
  return countDocuments(db, collectionName);
};

export const getMongoTest: MongoGetQueryMethodType = async (
  db: MongoDb,
  skip: number,
  limit: number,
  id: number | null = null
) => {
  const collectionName = 'test';
  return getDataFilteredById(db, collectionName, skip, limit, id);
};

export const addMongoMany: MongoAddQueryMethodType = async (db: MongoDb, data: TestData[]) => {
  const collectionName = 'test';
  const collection = db.collection(collectionName);
  await collection.insertMany(data);
};

export const updateMongoAll: MongoUpdateQueryMethodType = async (
  db: MongoDb,
  data: TestDataWithoutId
) => {
  const collectionName = 'test';
  const collection = db.collection(collectionName);
  await collection.updateMany({ id: { $gt: 1 } }, { $set: data });
};

export const deleteMongoAll: MongoDeleteQueryMethodType = async (db: MongoDb) => {
  const collectionName = 'test';
  const collection = db.collection(collectionName);
  await collection.deleteMany({ id: { $ne: 1 } });
};
