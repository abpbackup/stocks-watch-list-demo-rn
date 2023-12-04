import Fuse from 'fuse.js';

import { Stock } from '../types/types';

const fuseOptions = {
  keys: ['companyName', 'ticker'],
  includeScore: true,
  threshold: 0.3,
};

export const createFuzzySearch = (stocks: Stock[]): Fuse<Stock> => {
  return new Fuse(stocks, fuseOptions);
};
