import React, { useEffect } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity } from 'react-native';

import { View, Text } from './Themed';

export const ErrorBanner = ({ error, onClose }: { error: string; onClose: () => void }) => {
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Error❕ </Text>
      <Text numberOfLines={2} style={styles.text}>
        {error}
      </Text>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>Close x</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: 'red',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  text: {
    fontSize: 13,
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
  closeText: {
    fontSize: 13,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
