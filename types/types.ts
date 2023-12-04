export type Stock = {
  companyName: string;
  ticker: string;
  price?: number;
  isInWatchlist?: boolean;
  lastClosePrice?: number;
};

export type ToggleMode = 'amount' | 'percent';

export type ApiStocksResponse = {
  [ticker: string]: string;
};

export type ApiPricesResponse = {
  [ticker: string]: StockPrice;
};

export type StockPrice = {
  price: number;
  last_close: number;
};
