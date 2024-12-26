import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { fetchMenuByCategories } from './database';

const categories = [
  'starters',
  'mains',
  'desserts',
  'drinks',
  'specials',
  'salads',
  'soups',
];

const CategoryList = ({ onCategoryChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  // This function toggles the category selection state
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  useEffect(() => {
    // Update the parent with the selected categories
    onCategoryChange(selectedCategories);
  }, [selectedCategories, onCategoryChange]);

  const renderCategory = ({ item }) => {
    const isSelected = selectedCategories.includes(item);
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && styles.selectedCategoryItem,
        ]}
        onPress={() => toggleCategory(item)}
      >
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order For Delivery!</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 12,
  },
  categoryList: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedCategoryItem: {
    backgroundColor: '#495e57',
    borderColor: '#495e57',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryList;