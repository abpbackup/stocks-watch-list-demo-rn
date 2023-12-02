import React from 'react';
import { StyleSheet } from 'react-native';

import { View, Text } from './Themed';

export const Searching = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Seaching...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
