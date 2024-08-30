import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Animated } from 'react-native';

const SearchBar = ({ initialValue = '', onSearch, placeholder }) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChangeText = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <Animated.View style={[styles.container, { opacity: animation }]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleChangeText}
        autoFocus
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    margin: 15,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 15,
    fontSize: 16,
  },
});

export default SearchBar;