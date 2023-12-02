import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { View, TextInput } from '../components/Themed';

const SEARCH_DEBOUNCE = 300;

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Call onSearch with the debounced query
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search stocks"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          clearButtonMode="always"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
  },
});
