import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { View, Text } from './Themed';
import { ToggleMode } from '../constants/types';
import StarIcon from './StarIcon';
import { primaryColor } from '../constants/Colors';
import PricePlaceholder from './PricePlaceholder';
import { TrashIcon } from './TrashIcon';

declare type AnimatedInterpolation = ReturnType<Animated.Value['interpolate']>;

type StockItemProps = {
  companyName: string;
  ticker: string;
  price: number | undefined;
  isInWatchlist: boolean | undefined;
  lastClosePrice: number | undefined;
  lastCloseMode: ToggleMode;
  onToggleWatchlist: (ticker: string) => void;
  onToggleLastCloseMode: () => void;
};

export const StockItem = React.memo(
  ({
    companyName,
    ticker,
    price,
    lastClosePrice,
    isInWatchlist = false,
    lastCloseMode = 'amount',
    onToggleWatchlist,
    onToggleLastCloseMode,
  }: StockItemProps) => {
    const theme = useColorScheme() ?? 'light';

    const starFillColor = useMemo(() => {
      return theme === 'dark' ? (isInWatchlist ? 'blue' : 'white') : isInWatchlist ? primaryColor : '#ddd';
    }, [theme, isInWatchlist]);
    const starBorderColor = useMemo(() => {
      return theme === 'dark' ? (isInWatchlist ? 'white' : 'gray') : isInWatchlist ? primaryColor : '#aaa';
    }, [theme, isInWatchlist]);

    const lastCloseChange = useMemo(() => {
      const priceDiff = Number(price) - Number(lastClosePrice);
      const percentChange = (priceDiff / Number(lastClosePrice)) * 100;
      const prefix = lastCloseMode === 'amount' ? '$ ' : '';
      const suffix = lastCloseMode === 'percent' ? ' %' : '';
      const val = (lastCloseMode === 'amount' ? priceDiff : percentChange).toFixed(2);
      return `${prefix}${val}${suffix}`;
    }, [price, lastClosePrice, lastCloseMode]);

    const lastCloseColor = useMemo(() => {
      const priceDiff = Number(price) - Number(lastClosePrice);
      return priceDiff > 0 ? 'green' : priceDiff < 0 ? 'red' : undefined;
    }, [price, lastClosePrice, lastCloseMode]);

    const renderRightActions = (_: any, dragX: AnimatedInterpolation) => {
      const trans = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [0, 80],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View style={[{ transform: [{ translateX: trans }] }]}>
          <TouchableOpacity onPress={() => onToggleWatchlist(ticker)} style={styles.deleteBox}>
            <TrashIcon />
          </TouchableOpacity>
        </Animated.View>
      );
    };

    return (
      !!ticker && (
        <Swipeable enabled={isInWatchlist} renderRightActions={renderRightActions}>
          <View style={styles.container}>
            <View style={styles.data}>
              <View style={styles.header}>
                <View style={styles.tickerContainer}>
                  <Text style={styles.ticker}>{ticker}</Text>
                  <Text numberOfLines={1} style={styles.name}>
                    {companyName}
                  </Text>
                </View>
                <TouchableOpacity style={styles.priceContainer} onPress={onToggleLastCloseMode}>
                  <Text style={styles.price}>$ {price ? price?.toFixed(2) : <PricePlaceholder />}</Text>
                  <Text style={[styles.closePrice, { color: lastCloseColor }]}>{price ? lastCloseChange : null}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.starContainer} onPress={() => onToggleWatchlist(ticker)}>
              <StarIcon color={starFillColor} borderColor={starBorderColor} size={30} />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          </View>
        </Swipeable>
      )
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal: 20,
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
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});
