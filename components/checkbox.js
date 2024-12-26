import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Checkbox = ({ label, checked, onChange }) => (
 <TouchableOpacity 
   style={styles.checkboxContainer} 
   onPress={() => onChange(!checked)}
 >
   <View style={[styles.checkbox, checked && styles.checked]}>
     {checked && <Text style={styles.checkmark}>✓</Text>}
   </View>
   <Text style={styles.label}>{label}</Text>
 </TouchableOpacity>
);

const styles = StyleSheet.create({
 checkboxContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginVertical: 10,
 },
 checkbox: {
   width: 20,
   height: 20,
   borderWidth: 2,
   borderColor: '#000',
   borderRadius: 3,
   justifyContent: 'center',
   alignItems: 'center',
 },
 checked: {
   backgroundColor: '#000',
 },
 checkmark: {
   color: '#fff',
   fontSize: 14,
 },
 label: {
   marginLeft: 8,
 },
});

export default Checkbox;