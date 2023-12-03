import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useColorScheme, Pressable, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

export const InfoButton = () => {
  const colorScheme = useColorScheme();

  return (
    <Link href="/about" asChild>
      <Pressable style={styles.pressable}>
        {({ pressed }) => (
          <FontAwesome
            name="info-circle"
            size={25}
            color={Colors[colorScheme ?? 'light'].text}
            style={{ opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  pressable: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
