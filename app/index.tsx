import { FlatList, Platform, StatusBar, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import { SearchBar } from '../components/SearchBar';
import { StockItem } from '../components/StockItem';
import { View, Text, SafeAreaView } from '../components/Themed';
import { useMainState } from '../hooks/useMainState';
import { NoResults } from '../components/NoResults';
import { SEARCH_RESULTS_MARGIN_OFFSET } from '../constants/ui';
import { Searching } from '../components/Searching';
import { useIsConnected } from '../providers/NetworkProvider';
import { OfflineBanner } from '../components/OfflineBanner';
import { ErrorBanner } from '../components/ErrorBanner';

const Home = () => {
  const {
    query,
    loading,
    searchResults,
    watchlistStocks,
    lastCloseMode,
    error,
    setError,
    handleSearch,
    handleToggleWatchlist,
    handleToggleLastCloseMode,
  } = useMainState();

  const isConnected = useIsConnected();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
        <View style={{ width: '100%', flex: 1, paddingHorizontal: 10 }}>
          <View style={styles.searchBarContainer}>
            <SearchBar isConnected={isConnected} onSearch={handleSearch} />
          </View>

          {!!query && error == '' && (
            <BlurView style={styles.blurView} intensity={10}>
              {loading && <Searching />}

              {!loading && searchResults.length > 0 && (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.ticker}
                  renderItem={({ item }) => (
                    <StockItem
                      companyName={item.companyName}
                      ticker={item.ticker}
                      price={item.price}
                      isInWatchlist={item.isInWatchlist}
                      lastClosePrice={item.lastClosePrice}
                      lastCloseMode={lastCloseMode}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleLastCloseMode={handleToggleLastCloseMode}
                    />
                  )}
                  keyboardShouldPersistTaps={'handled'}
                />
              )}

              {!loading && searchResults.length === 0 && <NoResults />}
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
                companyName={item.companyName}
                ticker={item.ticker}
                price={item.price}
                isInWatchlist={true}
                lastClosePrice={item.lastClosePrice}
                lastCloseMode={lastCloseMode}
                onToggleWatchlist={handleToggleWatchlist}
                onToggleLastCloseMode={handleToggleLastCloseMode}
              />
            )}
            style={styles.watchlistList}
            contentContainerStyle={{ justifyContent: 'center' }}
            keyboardShouldPersistTaps={'handled'}
          />
        </View>
      </SafeAreaView>

      {!isConnected && <OfflineBanner />}

      {!!error && <ErrorBanner error={error} onClose={() => setError('')} />}
    </>
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
