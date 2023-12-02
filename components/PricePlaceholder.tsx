import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const PricePlaceholder = () => {
  const fadeAnim = useRef(new Animated.Value(0.5)).current; // Initial opacity

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.placeholder,
        { opacity: fadeAnim }, // Bind opacity to animated value
      ]}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 20,
    width: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default PricePlaceholder;
