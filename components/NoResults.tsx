import React from 'react';
import { StyleSheet } from 'react-native';

import { View, Text } from './Themed';
import { BlurView } from 'expo-blur';
import { SEARCH_RESULTS_MARGIN_OFFSET } from '../constants/ui';

export const NoResults = () => (
  <BlurView style={styles.blurView} intensity={10}>
    <View style={styles.container}>
      <Text style={styles.text}>No results found</Text>
    </View>
  </BlurView>
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
  blurView: {
    ...StyleSheet.absoluteFillObject,
    marginTop: SEARCH_RESULTS_MARGIN_OFFSET,
    zIndex: 2,
  },
});
