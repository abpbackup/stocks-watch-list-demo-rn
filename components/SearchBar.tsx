import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

import { View } from '../components/Themed';

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
          placeholder="Search for stocks"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          clearButtonMode="always" // iOS only: shows a clear button within the input
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
});
