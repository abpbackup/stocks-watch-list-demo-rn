export type Stock = {
  companyName: string;
  ticker: string;
  price?: number;
  isStarred?: boolean;
  lastClosePrice?: number;
};

export type ToggleMode = 'amount' | 'percent';
