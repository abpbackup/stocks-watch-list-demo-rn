import { FlatList, StyleSheet } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BlurView } from 'expo-blur';

import { SearchBar } from '../components/SearchBar';
import { Stock } from '../constants/types';
import { fuse } from '../utils/fuse';
import { StockItem } from '../components/StockItem';
import { mockStocks } from '../assets/mock/stocks';
import { View, Text, SafeAreaView } from '../components/Themed';

// Needed for the blur effect
const SEARCH_RESULTS_MARGIN_OFFSET = 110;

const Home = () => {
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [starredStocks, setStarredStocks] = useState<Stock[]>([]);

  const stocksRef = useRef<Map<string, Stock>>(new Map());
  const searchResultsRef = useRef<Map<string, Stock>>(new Map());
  const starredStocksRef = useRef<Map<string, Stock>>(new Map());

  const performSearch = useCallback(async (query: string) => {
    searchResultsRef.current.clear();

    if (query === '') {
      setSearchResults([]);
      return;
    }

    const fuseResults = fuse.search(query);
    const foundStocks = fuseResults.map((result) => result.item);
    foundStocks.map((stock) => searchResultsRef.current.set(stock.ticker, stock));
    setSearchResults(foundStocks);
  }, []);

  const handleToggleStar = useCallback((ticker: string) => {
    // Updates the search results
    const stock = searchResultsRef.current.get(ticker);
    if (stock) {
      searchResultsRef.current.set(ticker, { ...stock, isStarred: !stock.isStarred });
      setSearchResults(Array.from(searchResultsRef.current.values()));
    }

    // Updates the starred list
    const isStarred = starredStocksRef.current.has(ticker);
    if (isStarred) {
      starredStocksRef.current.delete(ticker);
    } else {
      const stock = stocksRef.current.get(ticker);
      if (stock) {
        stock.isStarred = true;
        starredStocksRef.current.set(ticker, stock);
      }
    }
    setStarredStocks(Array.from(starredStocksRef.current.values()));
  }, []);

  useEffect(() => {
    mockStocks.forEach((stock) => stocksRef.current.set(stock.ticker, stock));
    const starred = mockStocks.filter((s) => s.isStarred);
    starred.forEach((stock) => starredStocksRef.current.set(stock.ticker, stock));
    setStarredStocks(starred);
  }, [mockStocks]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchBarContainer}>
        <SearchBar onSearch={performSearch} />
      </View>

      {searchResults.length > 0 && (
        <BlurView style={styles.blurView} intensity={10}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.ticker}
            renderItem={({ item }) => <StockItem stock={item} onToggleStar={handleToggleStar} />}
          />
        </BlurView>
      )}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Stocks watchlist</Text>
      </View>

      <FlatList
        data={starredStocks}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => <StockItem stock={item} onToggleStar={handleToggleStar} />}
        style={styles.starredList}
        contentContainerStyle={{ justifyContent: 'center' }}
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
