import { useCallback, useEffect, useRef, useState } from 'react';

import { Stock, ToggleMode } from '../types/types';
import { store } from '../store/store';
import { stockApi } from '../services/stock.api';
import { Keyboard } from 'react-native';

const UPDATE_INTERVAL_IN_MS = 5 * 1000;

export const useMainState = () => {
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [watchlistStocks, setWatchlistStocks] = useState<Stock[]>([]);
  const [lastCloseMode, setLastCloseMode] = useState<ToggleMode>('amount');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const watchlistRef = useRef<Map<string, Stock>>(new Map());
  const searchResultsRef = useRef<Map<string, Stock>>(new Map());
  const updateInterval = useRef<NodeJS.Timeout>();
  const searchRef = useRef<{ clearSearchInput: () => void }>();

  /**
   * Note for improvement: In a multi-page app this should be handled with a provider for the whole app
   */
  const errorHandler = (error: any) => {
    cancelSearch();
    setError(String(error));

    // Note for improvement: Integrate with a logger provider like Datadog, Sentry, Highlight.io
    console.error(error);
  };

  const cancelSearch = () => {
    setLoading(false);
    setSearchResults([]);
    setQuery('');
    closeKeyboard();
    searchRef.current?.clearSearchInput();
  };

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSearch = useCallback(async (query: string) => {
    searchResultsRef.current.clear();
    setQuery(query);

    if (query === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const stocks = await stockApi.findStocks(query);
      if (stocks instanceof AbortSignal) {
        return;
      }

      let searchedStocks: Stock[] = [];
      stocks.forEach((stock) => {
        const isInWatchList = watchlistRef.current.has(stock.ticker);
        stock.isInWatchlist = isInWatchList;
        searchResultsRef.current.set(stock.ticker, stock);
        searchedStocks.push(stock);
      });
      setLoading(false);
      setSearchResults(searchedStocks);

      // Note for improvement: I'd be better for the user experience if the search endPoint sent the prices
      // in the payload so the user don't have to wait for a second or two the prices info while in the search
      // results. The "static info" (ticker:name) could be in a cache (redis for instance) so that the query
      // in the backend doesn't need to go the the database to look for coincidences but immediately for prices
      retrieveStockPricesFromApi(searchedStocks);
    } catch (error) {
      errorHandler(error);
    }
  }, []);

  const handleToggleWatchlist = useCallback((ticker: string) => {
    // Updates the search results
    const searchStock = searchResultsRef.current.get(ticker);
    if (searchStock) {
      searchResultsRef.current.set(ticker, { ...searchStock, isInWatchlist: !searchStock.isInWatchlist });
      setSearchResults(Array.from(searchResultsRef.current.values()));
    }

    // Updates the watchlist
    const stock = watchlistRef.current.get(ticker);
    if (stock) {
      watchlistRef.current.delete(ticker);
    } else if (searchStock) {
      watchlistRef.current.set(ticker, searchStock);
    }
    const watchlist = Array.from(watchlistRef.current.values()).sort((a, b) => a.ticker.localeCompare(b.ticker));
    setWatchlistStocks(watchlist);
    store.save('watchlist', watchlist);
  }, []);

  const handleToggleLastCloseMode = useCallback(() => {
    setLastCloseMode((prev) => (prev === 'amount' ? 'percent' : 'amount'));
  }, []);

  /**
   * Get the prices for the watchlist stocks
   */
  const retrieveStockPricesFromApi = async (watchlist: Stock[], fromSearch = true) => {
    if (watchlist.length === 0) {
      return;
    }

    try {
      const tickers = watchlist.map((s) => s.ticker);
      const resp = await stockApi.getStockPrices(tickers);

      // update the prices in the state
      let shouldUpdateWatchlist = false;
      for (const [ticker, prices] of Object.entries(resp)) {
        if (fromSearch) {
          const searchStock = searchResultsRef.current.get(ticker);
          if (searchStock) {
            searchResultsRef.current.set(ticker, {
              ...searchStock,
              price: prices.price,
              lastClosePrice: prices.last_close,
            });
          }
        }

        const watchlistStock = watchlistRef.current.get(ticker);
        if (watchlistStock) {
          shouldUpdateWatchlist = true;
          watchlistRef.current.set(ticker, {
            ...watchlistStock,
            price: prices.price,
            lastClosePrice: prices.last_close,
          });
        }
      }

      // Render changes in the search results
      if (fromSearch) {
        const updatedSearchList = Array.from(searchResultsRef.current.values());
        setSearchResults(updatedSearchList);
      }

      // Render changes and save to store
      if (shouldUpdateWatchlist) {
        const updatedWatchList = Array.from(watchlistRef.current.values()).sort((a, b) =>
          a.ticker.localeCompare(b.ticker)
        );
        setWatchlistStocks(updatedWatchList);
        store.save('watchlist', updatedWatchList);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    /**
     * Ensure the user always have the stocks list (at least after the first time the app is open) so both
     * the search and the watchList are populated. If the user does NOT have internet access, the offline
     * mode/UI is triggered
     */
    const retrieveStocksFromLocalStore = async () => {
      try {
        const watchlist = await store.get('watchlist');
        watchlist.forEach((stock) => watchlistRef.current.set(stock.ticker, stock));
        setWatchlistStocks(watchlist);

        retrieveStockPricesFromApi(watchlist, false);
      } catch (error) {
        errorHandler(error);
      }
    };
    retrieveStocksFromLocalStore();

    const startPriceUpdatesInterval = () => {
      updateInterval.current = setInterval(() => {
        const watchlistTickers = Array.from(watchlistRef.current.values()).map((s) => s);
        const searchTickers = Array.from(searchResultsRef.current.values()).map((s) => s);
        const tickers = [...watchlistTickers, ...searchTickers];

        try {
          retrieveStockPricesFromApi(tickers, searchTickers.length > 0);
        } catch (error) {
          errorHandler(error);
        }
      }, UPDATE_INTERVAL_IN_MS);
    };
    startPriceUpdatesInterval();

    return () => {
      clearInterval(updateInterval.current);
    };
  }, []);

  return {
    query,
    loading,
    searchResults,
    watchlistStocks,
    lastCloseMode,
    error,
    searchRef,
    setError,
    handleSearch,
    handleToggleWatchlist,
    handleToggleLastCloseMode,
    cancelSearch,
    closeKeyboard,
  };
};
