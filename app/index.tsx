import { FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useCallback, useState } from 'react';

import { SearchBar } from '../components/SearchBar';
import { Stock } from '../constants/types';
import { fuse } from '../utils/fuse';
import { StockInfo } from '../components/Stock';

const Home = () => {
  const [searchResults, setSearchResults] = useState<Stock[]>([]);

  const performSearch = useCallback(async (query: string) => {
    if (query === '') {
      setSearchResults([]);
      return;
    }

    const fuseResults = fuse.search(query);
    const foundStocks = fuseResults.map((result) => result.item);
    console.log(foundStocks);

    setSearchResults(foundStocks);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchBar onSearch={performSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => <StockInfo stock={item} />}
        style={{ width: '100%' }}
        contentContainerStyle={{ justifyContent: 'center' }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
