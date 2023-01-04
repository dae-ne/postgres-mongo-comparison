import { ParsedQs } from 'qs';

const DEFAULT_PAGE_NO = 1;
const DEFAULT_PAGE_SIZE = 50;

export const getPaginationParams = (query: ParsedQs) => {
  const { page, size } = query;
  const pageValue = page ? +page : DEFAULT_PAGE_NO;
  const sizeValue = size ? +size : DEFAULT_PAGE_SIZE;
  return { page: pageValue, size: sizeValue };
};
