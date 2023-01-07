import { ParsedQs } from 'qs';
import { MONGO_NAME, POSTGRES_NAME } from '../config/constants';

const DEFAULT_PAGE_NO = 1;
const DEFAULT_PAGE_SIZE = 50;

const DEFAULT_STATS_FIRST_VALUE = 1;
const DEFAULT_STATS_LAST_VALUE = 10;
const DEFAULT_STATS_STEP_VALUE = 1;

export const getPaginationQueryStringParams = (query: ParsedQs) => {
  const { page, size } = query;
  const pageValue = page ? +page : DEFAULT_PAGE_NO;
  const sizeValue = size ? +size : DEFAULT_PAGE_SIZE;
  return { page: pageValue, size: sizeValue };
};

export const getStatsQueryStringParams = (query: ParsedQs) => {
  const { first, last, step, db } = query;
  const firstValue = first ? +first : DEFAULT_STATS_FIRST_VALUE;
  const lastValue = last ? +last : DEFAULT_STATS_LAST_VALUE;
  const stepValue = step ? +step : DEFAULT_STATS_STEP_VALUE;
  const dbValue: string | string[] = db?.toString() ?? [POSTGRES_NAME, MONGO_NAME];
  const dbValueArr = !Array.isArray(dbValue) ? [...dbValue.split(',')] : dbValue;
  return { first: firstValue, last: lastValue, step: stepValue, db: dbValueArr };
};

export const pageWithSizeToOffset = (page: number, size: number) => (page - 1) * size;
