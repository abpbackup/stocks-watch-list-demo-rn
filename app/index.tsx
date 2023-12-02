import { FlatList, StyleSheet } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';

import { SearchBar } from '../components/SearchBar';
import { Stock } from '../constants/types';
import { fuse } from '../utils/fuse';
import { StockInfo } from '../components/Stock';
import { mockStocks } from '../assets/mock/stocks';
import { View, Text, SafeAreaView } from '../components/Themed';

// Needed for the blur effect
const SEARCH_RESULTS_MARGIN_OFFSET = 110;

const Home = () => {
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [starredStocks, setStarredStocks] = useState<Stock[]>([]);

  const performSearch = useCallback(async (query: string) => {
    if (query === '') {
      setSearchResults([]);
      return;
    }

    const fuseResults = fuse.search(query);
    const foundStocks = fuseResults.map((result) => result.item);
    setSearchResults(foundStocks);
  }, []);

  useEffect(() => {
    const starred = mockStocks.filter((s) => s.isStarred);
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
            renderItem={({ item }) => <StockInfo stock={item} />}
          />
        </BlurView>
      )}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Stocks watchlist</Text>
      </View>

      <FlatList
        data={starredStocks}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => <StockInfo stock={item} />}
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
