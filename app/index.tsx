import { FlatList, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import { SearchBar } from '../components/SearchBar';
import { StockItem } from '../components/StockItem';
import { View, Text, SafeAreaView } from '../components/Themed';
import { useMainState } from '../hooks/useMainState';

// Needed for the blur effect
const SEARCH_RESULTS_MARGIN_OFFSET = 110;

const Home = () => {
  const {
    searchResults,
    watchlistStocks,
    lastCloseMode,
    handleSearch,
    handleToggleWatchlist,
    handleToggleLastCloseMode,
  } = useMainState();

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
                onToggleWatchlist={handleToggleWatchlist}
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
        data={watchlistStocks}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => (
          <StockItem
            stock={{ ...item, isInWatchlist: true }}
            lastCloseMode={lastCloseMode}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLastCloseMode={handleToggleLastCloseMode}
          />
        )}
        style={styles.watchlistList}
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
  watchlistList: {
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
