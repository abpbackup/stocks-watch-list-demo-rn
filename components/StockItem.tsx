import React, { useMemo } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

import { View, Text } from './Themed';
import { Stock, ToggleMode } from '../constants/types';

const starredIcon = require('../assets/images/ic_star.png');
const noStarredIcon = require('../assets/images/ic_star_border.png');

type StockItemProps = {
  stock: Stock;
  lastCloseMode: ToggleMode;
  onToggleWatchlist: (ticker: string) => void;
  onToggleLastCloseMode: () => void;
};

export const StockItem = ({
  stock,
  lastCloseMode = 'amount',
  onToggleWatchlist,
  onToggleLastCloseMode,
}: StockItemProps) => {
  const lastCloseChange = useMemo(() => {
    const priceDiff = Number(stock.price) - Number(stock.lastClosePrice);
    const percentChange = (priceDiff / Number(stock.lastClosePrice)) * 100;
    const prefix = lastCloseMode === 'amount' ? '$ ' : '';
    const sufix = lastCloseMode === 'percent' ? ' %' : '';
    const val = (lastCloseMode === 'amount' ? priceDiff : percentChange).toFixed(2);
    return `${prefix}${val}${sufix}`;
  }, [stock, lastCloseMode]);

  const lastCloseColor = useMemo(() => {
    const priceDiff = Number(stock.price) - Number(stock.lastClosePrice);
    return priceDiff > 0 ? 'green' : priceDiff < 0 ? 'red' : undefined;
  }, [stock, lastCloseMode]);

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
                <Text style={styles.price}>$ {stock.price?.toFixed(2)}</Text>
                <Text style={[styles.closePrice, { color: lastCloseColor }]}>{lastCloseChange}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.starContainer} onPress={() => onToggleWatchlist(stock.ticker)}>
            <Image source={stock.isInWatchlist ? starredIcon : noStarredIcon} style={styles.star} />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
      </>
    )
  );
};

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
