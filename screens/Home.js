import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CategoryList from '../components/categories';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  fetchFilteredMenuFromDatabase,
  initializeDatabase
} from '../components/database';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuData, setMenuData] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    initializeDatabase();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchFilteredMenu = async () => {
      const filteredMenu = await fetchFilteredMenuFromDatabase(filteredCategories, searchQuery);
      setMenuData(filteredMenu);
    };

    fetchFilteredMenu();
  }, [filteredCategories, searchQuery]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      fetchFilteredMenuFromDatabase(filteredCategories, text).then((filteredMenu) => {
        setMenuData(filteredMenu);
        setIsLoading(false);
      });
    }, 500);

    setDebounceTimeout(timeout);
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
        }}
        style={styles.menuImage}
      />
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
        <Text style={styles.menuPrice}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.heroArea}>
        <Text style={styles.heading}>Little Lemon</Text>
        <View style={styles.flexBox}>
          <View style={styles.lhs}>
            <Text style={styles.subheading}>Chicago</Text>
            <Text style={styles.description}>
              We are a family-owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <View style={styles.rhs}>
            <Image
              source={require('../assets/images/heroimage.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>
      <CategoryList
        categories={categories}
        onCategoryChange={setFilteredCategories}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#495e57" />
      ) : (
        <View style={styles.menuListWrapper}>
          <FlatList
            data={menuData}
            renderItem={renderMenuItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.menuList}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  heroArea: {
    padding: 16,
    backgroundColor: '#495e57',
  },
  flexBox: {
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#f4ce14',
    fontFamily: 'serif',
  },
  subheading: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 15,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  image: {
    width: 'auto',
    height: 150,
    borderRadius: 16,
    marginTop: 10,
  },
  lhs: {
    flex: 2,
  },
  rhs: {
    flex: 1,
    textAlign: 'right',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    paddingVertical: 16,
    paddingRight: 15,
    columnGap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: 'white',
  },
  menuImage: {
    width: 100,
    height: 100,
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuDescription: {
    color: '#666666',
    marginVertical: 8,
  },
  menuPrice: {
    fontSize: 16,
    color: '#495e57',
    fontWeight: '600',
  },
  menuList: {
    paddingVertical: 0,
  },
  menuListWrapper: {
    flex: 1,
  },
});

export default Home;
