import Constants from 'expo-constants';
import { ApiPricesResponse, ApiStocksResponse, Stock } from '../constants/types';

const createRestApi = () => {
  // Create an instance of AbortController
  let abortController = new AbortController();

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

  /**
   * Even though the search bar has a proper debounce, it's very normal that the
   * user types slow enough to trigger the search. The incoming search cancels
   * a previous one so the user don't get partial/incorrect results (especially)
   * when deleting some chars and adding new ones. In case of aborting, the proper
   * signal is sent so the consumer ignores the response and DOES NOT render "Not found"
   */
  const findStocks = async (query: string): Promise<Stock[] | AbortSignal> => {
    abortController.abort();
    abortController = new AbortController();

    try {
      const url = `${apiUrl}search/?query=${query}`;
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Albert-Case-Study-API-Key': apiKey,
        },
        signal: abortController.signal,
      });

      if (res.ok) {
        const data = await res.json();
        return mapStockResponseToStocks(data);
      } else {
        throw new Error(`statusText: ${res.statusText}, statusCode: ${res.status}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return abortController.signal;
        } else {
          throw new Error(`At findStocks [${String(error)}]`);
        }
      } else {
        throw new Error(`At findStocks [${String(error)}]`);
      }
    }
  };

  const getStockPrices = async (tickers: string[]): Promise<ApiPricesResponse> => {
    try {
      const url = `${apiUrl}prices/?tickers=${tickers.join(',')}`;
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Albert-Case-Study-API-Key': apiKey,
        },
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error(`statusText: ${res.statusText}, statusCode: ${res.status}`);
      }
    } catch (error) {
      throw new Error(`At getStockPrices [${String(error)}]`);
    }
  };

  return {
    findStocks,
    getStockPrices,
  };
};

export const stockApi = createRestApi();
