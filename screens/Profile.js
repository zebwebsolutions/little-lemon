import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from '../components/checkbox';
import { MaskedTextInput } from 'react-native-mask-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [osChecked, setOsChecked] = useState(false);
  const [pcChecked, setPcChecked] = useState(false);
  const [soChecked, setSoChecked] = useState(false);
  const [nChecked, setNChecked] = useState(false);
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    console.log(navigation);
  }, [navigation]);

  // Load saved data from AsyncStorage when the app starts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedImage = await AsyncStorage.getItem('avatar');
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPhone = await AsyncStorage.getItem('phone');
        const storedOsChecked = await AsyncStorage.getItem('osChecked');
        const storedPcChecked = await AsyncStorage.getItem('pcChecked');
        const storedSoChecked = await AsyncStorage.getItem('soChecked');
        const storedNChecked = await AsyncStorage.getItem('nChecked');

        if (storedImage) setImage(storedImage);
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);
        if (storedOsChecked) setOsChecked(JSON.parse(storedOsChecked));
        if (storedPcChecked) setPcChecked(JSON.parse(storedPcChecked));
        if (storedSoChecked) setSoChecked(JSON.parse(storedSoChecked));
        if (storedNChecked) setNChecked(JSON.parse(storedNChecked));
      } catch (error) {
        console.error('Error loading profile data', error);
      }
    };

    loadProfileData();
  }, []);

  // Function to open the image picker
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  // Save data to AsyncStorage
  const saveProfileData = async () => {
    try {
      if (image) {
        await AsyncStorage.setItem('avatar', image); // Save image only if it's not null
      }
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('phone', phone);
      await AsyncStorage.setItem('osChecked', JSON.stringify(osChecked));
      await AsyncStorage.setItem('pcChecked', JSON.stringify(pcChecked));
      await AsyncStorage.setItem('soChecked', JSON.stringify(soChecked));
      await AsyncStorage.setItem('nChecked', JSON.stringify(nChecked));

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile data', error);
    }
  };

  // Clear AsyncStorage and navigate to the Onboarding screen
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();  // Clears all stored data
      navigation.navigate('Onboarding');  // Navigate to Onboarding screen
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>Personal information</Text>

          <View style={styles.avatarWrap}>
            <View style={styles.avatarContainer}>
              <Text>Avatar</Text>
              <TouchableOpacity onPress={pickImage} style={styles.avatarButton}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {firstName[0]}{lastName[0]}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.btnDark}>
                <Text style={styles.btnDarkText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Phone Number</Text>
          <MaskedTextInput
            mask="(207)-555-0113"
            onChangeText={(text, rawText) => {
              console.log(text);
              setPhone(rawText);
            }}
            value={phone}
            style={styles.input}
          />

          <View style={styles.checksWrap}>
            <Text style={styles.bigText}>Email Notifications</Text>
            <Checkbox
              label="Order statuses"
              checked={osChecked}
              onChange={setOsChecked}
            />
            <Checkbox
              label="Password changes"
              checked={pcChecked}
              onChange={setPcChecked}
            />
            <Checkbox
              label="Special offers"
              checked={soChecked}
              onChange={setSoChecked}
            />
            <Checkbox
              label="Newsletter"
              checked={nChecked}
              onChange={setNChecked}
            />
          </View>

          <View>
            <TouchableOpacity style={styles.cta} onPress={handleLogout}>
              <Text style={styles.ctaText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.btn}>
              <Text>Discard Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnDark} onPress={saveProfileData}>
              <Text style={styles.btnDarkText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  btn: {
    borderWidth: 2,
    borderColor: '#495e57',
    color: '#495e57',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  btnText: {
    color: '#495e57',
  },
  btnDark: {
    backgroundColor: '#495e57',
    borderWidth: 2,
    borderColor: '#495e57',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  btnDarkText: {
    color: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd', // Gray background for the placeholder
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White color for the initials
  },
  avatarButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: '#f1f1f1',
    borderRadius: 7,
    paddingLeft: 10,
    marginBottom: 16,
  },
  label: {
    marginBottom: 5,
  },
  bigText: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: '700',
  },
  checksWrap: {
    marginBottom: 10,
  },
  cta: {
    backgroundColor: '#f4ce14',
    padding: 14,
    marginVertical: 30,
    borderRadius: 10,
  },
  ctaText: {
    fontWeight: 700,
    textAlign: 'center',
  },
});


export default Profile;