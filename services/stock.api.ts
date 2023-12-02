import Constants from 'expo-constants';
import { ApiPricesResponse, ApiStocksResponse, Stock } from '../constants/types';

const createRestApi = () => {
  // Create an instance of AbortController
  const abortController = new AbortController();

  // Get the signal from the controller
  const abortSignal = abortController.signal;

  const { apiUrl, apiKey } = Constants.expoConfig?.extra || { apiKey: null, apiUrl: null };

  const mapStockResponseToStocks = (res: ApiStocksResponse) => {
    const stocks: Stock[] = [];
    for (const [ticker, name] of Object.entries(res)) {
      stocks.push({
        ticker,
        companyName: name,
      });
    }

    return stocks;
  };

  const findStocks = async (query: string): Promise<Stock[]> => {
    try {
      const url = `${apiUrl}search/?query=${query}`;
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Albert-Case-Study-API-Key': apiKey,
        },
        signal: abortSignal,
      });

      if (res.ok) {
        const data = await res.json();
        return mapStockResponseToStocks(data);
      } else {
        console.log('@ToDo error findStocks -> !res.ok', res.statusText, res.status);
        return [];
      }
    } catch (error) {
      console.log('@ToDo error', error);
      return [];
    }
  };

  const getStockPrices = async (tickers: string[]): Promise<ApiPricesResponse> => {
    console.log('!!!getStockPrices -> args', tickers);

    try {
      const url = `${apiUrl}prices/?tickers=${tickers.join(',')}`;
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Albert-Case-Study-API-Key': apiKey,
        },
        signal: abortSignal,
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        console.log('@ToDo error getStockPrices -> !res.ok', res.statusText, res.status);
        return {};
      }
    } catch (error) {
      console.log('@ToDo error getStockPrices', error);
      return {};
    }
  };

  return {
    findStocks,
    getStockPrices,
  };
};

export const stockApi = createRestApi();
