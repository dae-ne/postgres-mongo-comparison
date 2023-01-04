import { ParsedQs } from 'qs';

export const getPaginationParams = (query: ParsedQs) => {
  const { page, size } = query;
  return { page, size };
};
