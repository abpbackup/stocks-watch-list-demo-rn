import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

import { View, Text } from './Themed';
import { Stock, ToggleMode } from '../constants/types';
import StarIcon from './StarIcon';
import { primaryColor } from '../constants/Colors';
import PricePlaceholder from './PricePlaceholder';

type StockItemProps = {
  stock: Stock;
  lastCloseMode: ToggleMode;
  onToggleWatchlist: (ticker: string) => void;
  onToggleLastCloseMode: () => void;
};

export const StockItem = React.memo(
  ({ stock, lastCloseMode = 'amount', onToggleWatchlist, onToggleLastCloseMode }: StockItemProps) => {
    const theme = useColorScheme() ?? 'light';

    const starFillColor = useMemo(() => {
      return theme === 'dark' ? (stock.isInWatchlist ? 'blue' : 'white') : stock.isInWatchlist ? primaryColor : '#ddd';
    }, [theme]);
    const starBorderColor = useMemo(() => {
      return theme === 'dark' ? (stock.isInWatchlist ? 'white' : 'gray') : stock.isInWatchlist ? primaryColor : '#aaa';
    }, [theme]);

    const lastCloseChange = useMemo(() => {
      const priceDiff = Number(stock.price) - Number(stock.lastClosePrice);
      const percentChange = (priceDiff / Number(stock.lastClosePrice)) * 100;
      const prefix = lastCloseMode === 'amount' ? '$ ' : '';
      const suffix = lastCloseMode === 'percent' ? ' %' : '';
      const val = (lastCloseMode === 'amount' ? priceDiff : percentChange).toFixed(2);
      return `${prefix}${val}${suffix}`;
    }, [stock.price, stock.lastClosePrice, lastCloseMode]);

    const lastCloseColor = useMemo(() => {
      const priceDiff = Number(stock.price) - Number(stock.lastClosePrice);
      return priceDiff > 0 ? 'green' : priceDiff < 0 ? 'red' : undefined;
    }, [stock.price, stock.lastClosePrice, lastCloseMode]);

    return (
      stock && (
        <>
          <View style={styles.container}>
            <View style={styles.data}>
              <View style={styles.header}>
                <View style={styles.tickerContainer}>
                  <Text style={styles.ticker}>{stock.ticker}</Text>
                  <Text numberOfLines={1} style={styles.name}>
                    {stock.companyName}
                  </Text>
                </View>
                <TouchableOpacity style={styles.priceContainer} onPress={onToggleLastCloseMode}>
                  <Text style={styles.price}>$ {stock.price ? stock.price?.toFixed(2) : <PricePlaceholder />}</Text>
                  <Text style={[styles.closePrice, { color: lastCloseColor }]}>
                    {stock.price ? lastCloseChange : null}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.starContainer} onPress={() => onToggleWatchlist(stock.ticker)}>
              <StarIcon color={starFillColor} borderColor={starBorderColor} size={30} />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          </View>
        </>
      )
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  data: {
    flex: 1,
  },
  header: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  tickerContainer: {
    width: '60%',
  },
  ticker: {
    fontSize: 16,
  },
  priceContainer: {
    flexGrow: 1,
  },
  price: {
    fontSize: 16,
    textAlign: 'right',
  },
  closePrice: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  name: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  starContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    height: 30,
    width: 30,
  },
  separator: {
    marginVertical: 0,
    height: 1,
    width: '80%',
  },
});
