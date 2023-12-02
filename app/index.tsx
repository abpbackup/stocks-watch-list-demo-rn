import { FlatList, StyleSheet } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import Fuse, { FuseResult } from 'fuse.js';

import { SearchBar } from '../components/SearchBar';
import { Stock, ToggleMode } from '../constants/types';
import { createFuzzySearch } from '../utils/fuse';
import { StockItem } from '../components/StockItem';
import { mockStocks } from '../assets/mock/stocks';
import { View, Text, SafeAreaView } from '../components/Themed';
import { store } from '../store/store';

// Needed for the blur effect
const SEARCH_RESULTS_MARGIN_OFFSET = 110;

const Home = () => {
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [starredStocks, setStarredStocks] = useState<Stock[]>([]);
  const [lastCloseMode, setLastCloseMode] = useState<ToggleMode>('amount');

  const stocksRef = useRef<Map<string, Stock>>(new Map());
  const searchResultsRef = useRef<Map<string, Stock>>(new Map());
  const searcher = useRef<Fuse<Stock>>();

  const handleSearch = useCallback(async (query: string) => {
    searchResultsRef.current.clear();

    if (query === '') {
      setSearchResults([]);
      return;
    }

    if (!searcher.current) {
      console.log('@ToDO Manage this error');
      return;
    }

    const results: FuseResult<Stock>[] = searcher.current.search(query);
    const foundStocks = results.map((result) => result.item);

    // Need to ensure the results are in the current state and to get the starred state
    let searchedStocks: Stock[] = [];
    foundStocks.forEach((s) => {
      const stock = stocksRef.current.get(s.ticker);
      if (stock) {
        searchResultsRef.current.set(stock.ticker, stock);
        searchedStocks.push(stock);
      }
    });
    setSearchResults(searchedStocks);
  }, []);

  const handleToggleStar = useCallback((ticker: string) => {
    // Updates the search results
    const searchStock = searchResultsRef.current.get(ticker);
    if (searchStock) {
      searchResultsRef.current.set(ticker, { ...searchStock, isStarred: !searchStock.isStarred });
      setSearchResults(Array.from(searchResultsRef.current.values()));
    }

    // Updates the stocks list
    const stock = stocksRef.current.get(ticker);
    if (stock) {
      stocksRef.current.set(ticker, { ...stock, isStarred: !stock.isStarred });
      const starred = Array.from(stocksRef.current.values()).filter((s) => s.isStarred);
      setStarredStocks(starred);
      store.save('starred', starred);
    }
  }, []);

  const handleToggleLastCloseMode = useCallback(() => {
    setLastCloseMode((prev) => (prev === 'amount' ? 'percent' : 'amount'));
  }, []);

  useEffect(() => {
    /**
     * Ensure the user always have the stocks list (at least after the first time the app is open) so both
     * the search and the watchList are populated. If the user does NOT have internet access, the offline
     * mode/UI is triggered
     */
    const retrieveStocksFromLocalStore = async () => {
      try {
        const stocks = await store.get('stocks');
        stocks.forEach((stock) => stocksRef.current.set(stock.ticker, stock));

        const starred = await store.get('starred');
        starred.forEach((stock) => stocksRef.current.set(stock.ticker, { ...stock, isStarred: true }));
        setStarredStocks(starred);
      } catch (error) {
        console.log(error);
      }
    };
    retrieveStocksFromLocalStore();

    /**
     * Get the latest stock list to replace the data from the local storage
     */
    const retrieveStocksFromApi = async () => {
      try {
        const stocks = mockStocks;
        stocks.forEach((stock) => stocksRef.current.set(stock.ticker, stock));
        searcher.current = createFuzzySearch(stocks);
        store.save('stocks', stocks);
      } catch (error) {
        console.log(error);
      }
    };
    retrieveStocksFromApi();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchBarContainer}>
        <SearchBar onSearch={handleSearch} />
      </View>

      {searchResults.length > 0 && (
        <BlurView style={styles.blurView} intensity={10}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.ticker}
            renderItem={({ item }) => (
              <StockItem
                stock={item}
                lastCloseMode={lastCloseMode}
                onToggleStar={handleToggleStar}
                onToggleLastCloseMode={handleToggleLastCloseMode}
              />
            )}
            keyboardShouldPersistTaps={'handled'}
          />
        </BlurView>
      )}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Stocks watchlist</Text>
      </View>

      <FlatList
        data={starredStocks}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => (
          <StockItem
            stock={item}
            lastCloseMode={lastCloseMode}
            onToggleStar={handleToggleStar}
            onToggleLastCloseMode={handleToggleLastCloseMode}
          />
        )}
        style={styles.starredList}
        contentContainerStyle={{ justifyContent: 'center' }}
        keyboardShouldPersistTaps={'handled'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    width: '100%',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    marginTop: SEARCH_RESULTS_MARGIN_OFFSET,
    zIndex: 2,
  },
  starredList: {
    width: '100%',
  },
  titleContainer: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'flex-start',
    marginLeft: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Home;
