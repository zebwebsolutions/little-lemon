import * as SQLite from 'expo-sqlite';

let db;

const openDatabase = async () => {
  if (!db) {
    try {
      db = await SQLite.openDatabaseAsync('little_lemon.db');
      return db;
    } catch (error) {
      console.error('Failed to open database:', error);
      throw error;
    }
  }
  return db;
};

const createTable = async () => {
  const db = await openDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL,
        image TEXT,
        category TEXT
      );
    `);
    console.log("Table created successfully");
  } catch (error) {
    console.error("Error creating table", error);
  }
};

const addCategoryColumnIfNeeded = async () => {
  const db = await openDatabase();
  try {
    const result = await db.getAllAsync('PRAGMA table_info(menu)');
    const hasCategoryColumn = result.some(col => col.name === 'category');
    
    if (!hasCategoryColumn) {
      await db.execAsync('ALTER TABLE menu ADD COLUMN category TEXT');
      console.log('Category column added to menu table.');
    }
  } catch (error) {
    console.error('Error checking or adding category column:', error);
  }
};

const insertMenuData = async (menuItems) => {
  const db = await openDatabase();
  try {
    await db.runAsync('DELETE FROM menu'); // Clear the menu table
    const insertStatement = await db.prepareAsync(
      'INSERT INTO menu (name, description, price, image, category) VALUES ($name, $description, $price, $image, $category)'
    );

    for (const item of menuItems) {
      try {
        await insertStatement.executeAsync({
          $name: item.name,
          $description: item.description,
          $price: item.price,
          $image: item.image,
          $category: item.category,
        });
      } catch (insertError) {
        console.error(`Error inserting item ${item.name}:`, insertError);
      }
    }

    await insertStatement.finalizeAsync();
    console.log('Menu data inserted successfully.');
  } catch (error) {
    console.error("Error inserting menu data:", error);
  }
};

const fetchCategoriesFromDatabase = async () => {
  const db = await openDatabase();
  try {
    const results = await db.getAllAsync('SELECT DISTINCT category FROM menu');
    console.log('Fetched categories:', results);
    return results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const fetchFilteredMenuFromDatabase = async (filteredCategories, searchQuery) => {
  const db = await openDatabase();
  try {
    let query = 'SELECT * FROM menu';
    const queryParams = [];
    const conditions = [];

    if (filteredCategories.length > 0) {
      const placeholders = filteredCategories.map(() => '?').join(', ');
      conditions.push(`category IN (${placeholders})`);
      queryParams.push(...filteredCategories);
    }

    if (searchQuery.trim()) {
      conditions.push('name LIKE ?');
      queryParams.push(`%${searchQuery}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const results = await db.getAllAsync(query, queryParams);
    console.log('Fetched menu items:', results);
    return results;
  } catch (error) {
    console.error('Error fetching filtered menu data:', error);
    return [];
  }
};

const fetchMenuFromServer = async () => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
    );
    const data = await response.json();
    console.log("Data from server (immediately after JSON parsing):", data);

    if (!data.menu || !Array.isArray(data.menu)) {
      throw new Error('Invalid menu data format from server');
    }

    const validatedMenu = data.menu.map(item => ({
      name: item?.name ?? '',
      description: item?.description ?? '',
      price: parseFloat(item?.price) ?? 0,
      image: item?.image ?? '',
      category: item?.category ?? ''
    }));

    console.log('Validated menu data:', validatedMenu);
    return validatedMenu;
  } catch (error) {
    console.error('Error fetching menu from server:', error);
    throw error;
  }
};

const clearDatabase = async () => {
  const db = await openDatabase();
  try {
    await db.execAsync('DELETE FROM menu'); // Clear the menu table
    console.log('Database cleared successfully.');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

const dropTable = async () => {
  const db = await openDatabase();
  try {
    await db.execAsync('DROP TABLE IF EXISTS menu');
    console.log('Table dropped successfully.');
  } catch (error) {
    console.error('Error dropping table:', error);
  }
};

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    
    // Option 1: Clear the table (keeps the table structure)
    // await clearDatabase(); 

    // Option 2: Drop the table (removes the table entirely)
    //await dropTable();

    await createTable(); // Re-creates the table if it was dropped
    await addCategoryColumnIfNeeded(); // Ensure the category column exists

    console.log('Table created successfully.');

    const categoriesBefore = await fetchCategoriesFromDatabase();
    console.log("Categories before fetching from server:", categoriesBefore);

    const menuData = await fetchMenuFromServer();
    console.log('Menu data fetched from server:', JSON.stringify(menuData, null, 2));

    if (!menuData || menuData.length === 0) {
      console.error('No menu data received from server or empty array');
    } else {
      await insertMenuData(menuData);
      console.log('Menu data inserted successfully.');
    }

    const categoriesAfter = await fetchCategoriesFromDatabase();
    console.log("Categories after fetching from server:", categoriesAfter);

    const finalData = await fetchFilteredMenuFromDatabase([], '');
    console.log('Final database state:', JSON.stringify(finalData, null, 2));

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export {
  openDatabase,
  createTable,
  insertMenuData,
  fetchCategoriesFromDatabase,
  fetchFilteredMenuFromDatabase,
  fetchMenuFromServer,
  initializeDatabase,
  clearDatabase,
  dropTable,
};
