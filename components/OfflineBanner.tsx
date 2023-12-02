import React from 'react';
import { StyleSheet } from 'react-native';

import { View, Text } from './Themed';

export const OfflineBanner = () => (
  <View style={styles.container}>
    <Text style={styles.text}>It seems like you are offline ❕ </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#999',
  },
  text: {
    fontSize: 18,
    color: '#ddd',
  },
});
