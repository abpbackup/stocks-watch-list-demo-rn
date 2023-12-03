import { FlatList, Platform, StatusBar, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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
import { InfoButton } from '../components/InfoButton';
import WelcomeMessage from '../components/WelcomeMessage';

const Home = () => {
  const {
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
  } = useMainState();

  const isConnected = useIsConnected();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const showBlur = !!query;

  const screenHeight = Dimensions.get('window').height || 500;

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
        <View style={{ width: '100%', flex: 1 }}>
          <View style={styles.searchBarContainer}>
            <SearchBar ref={searchRef} isConnected={isConnected} onSearch={handleSearch} />
          </View>

          {!!query && error == '' && (
            <View
              style={[styles.searchResultsContainer, { maxHeight: screenHeight - SEARCH_RESULTS_MARGIN_OFFSET }]}
              onTouchEnd={closeKeyboard}
            >
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
            </View>
          )}

          {showBlur && <BlurView style={styles.blurView} intensity={10} onTouchEnd={cancelSearch} />}

          {watchlistStocks.length > 0 && (
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Stocks watchlist</Text>
              </View>

              <View style={styles.infoContainer}>
                <InfoButton />
              </View>
            </View>
          )}

          {watchlistStocks.length === 0 && (
            <View style={styles.welcomeMessageContainer}>
              <WelcomeMessage />
            </View>
          )}

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
            onTouchEnd={closeKeyboard}
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
  searchResultsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    marginTop: SEARCH_RESULTS_MARGIN_OFFSET,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    marginTop: SEARCH_RESULTS_MARGIN_OFFSET,
    zIndex: 1,
  },
  watchlistList: {
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 4,
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: 48,
  },
  titleContainer: {
    paddingLeft: 12,
    flexGrow: 1,
    height: '100%',
    justifyContent: 'center',
  },
  infoContainer: {
    height: '100%',
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  welcomeMessageContainer: {},
});

export default Home;
