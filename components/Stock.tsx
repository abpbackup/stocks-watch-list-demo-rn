import React from 'react';
import { StyleSheet, Image } from 'react-native';

import { View, Text } from './Themed';
import { Stock } from '../constants/types';

const starredIcon = require('../assets/images/ic_star.png');
const noStarredIcon = require('../assets/images/ic_star_border.png');

export const StockInfo = ({ stock }: { stock: Stock }) => {
  console.log({ stock });

  return (
    stock && (
      <>
        <View style={styles.container}>
          <View style={styles.data}>
            <View style={styles.header}>
              <View style={styles.tickerContainer}>
                <Text style={styles.ticker}>{stock.ticker}</Text>
              </View>
              <View style={styles.tickerContainer}>
                <Text style={styles.price}>{stock.price}</Text>
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.name}>{stock.companyName}</Text>
            </View>
          </View>
          <View style={styles.starContainer}>
            <Image source={stock.isStarred ? starredIcon : noStarredIcon} style={styles.star} />
          </View>
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
    flexGrow: 1,
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
  footer: { marginTop: 5 },
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
