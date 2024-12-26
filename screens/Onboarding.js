import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet } from 'react-native';

const Onboarding = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Validate input fields
  const validateInputs = () => {
    const isFirstNameValid = /^[A-Za-z]+$/.test(firstName);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsValid(isFirstNameValid && isEmailValid);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Little Lemon</Text>
        <Image
          source={require('../assets/images/Logo.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.inputsWrap}>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            validateInputs();
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateInputs();
          }}
          keyboardType="email-address"
        />
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <Button title="Next" onPress={() => {}} disabled={!isValid} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  inputsWrap: {
    backgroundColor: '#eee',
    padding: '30'
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  logo: {
    borderRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default Onboarding;