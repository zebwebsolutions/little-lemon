import * as React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Correct import for Ionicons
import Profile from '../../screens/Profile';
import Onboarding from '../../screens/Onboarding';
import Home from '../../screens/Home';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={({ navigation }) => ({
          headerTitle: () => (
            <Image 
              style={{ width: 100, height: 40 }}
              source={require('../../assets/images/Logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile');
                console.log('Profile pressed'); // Keep this for debugging
              }}
              style={{ padding: 10 }}
            >
              <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/images/Profile.png')}
                  style={{ width: 40, height: 40, borderRadius: 40 }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          )
        })} 
      />

      <Stack.Screen 
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          title: 'Profile',
          headerTitle: () => (
            <Image 
              style={{ width: 100, height: 40 }}
              source={require('../../assets/images/Logo.png')}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'center', // Center the header title
          headerRight: () => (
            <Image 
              source={require('../../assets/images/Profile.png')} 
              style={{width: 50, height: 50}} 
              resizeMode="cover"
            />
          ),
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()} // Use navigation here
            >
              <Ionicons name="arrow-back" size={16} color="white" />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen 
        name="Onboarding"
        component={Onboarding}
        options={{ title: 'Onboarding' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#495e57', // Blue background
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
