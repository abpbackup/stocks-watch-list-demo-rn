import Fuse from 'fuse.js';

import { mockStocks } from '../assets/stocks';

const fuseOptions = {
  keys: ['companyName', 'ticker'],
  includeScore: true,
  threshold: 0.3,
};

export const fuse = new Fuse(mockStocks, fuseOptions);
