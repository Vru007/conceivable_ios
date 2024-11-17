import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const toastConfig = {
  success: ({ text1, props }) => (
    <View style={{ backgroundColor: '#00C851', padding: 16, borderRadius: 8 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
      {props.text2 && <Text style={{ color: 'white' }}>{props.text2}</Text>}
    </View>
  ),
  error: ({ text1, props }) => (
    
    <View style={{ backgroundColor: '#ff4444', padding: 16, borderRadius: 8 }}>
    {console.log("error-text: ",text1)}
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
      {props.text2 && <Text style={{ color: 'white' }}>{props.text2}</Text>}
    </View>
  ),
  info: ({ text1, props }) => (
    <View style={{ backgroundColor: '#33b5e5', padding: 16, borderRadius: 8 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
      {props.text2 && <Text style={{ color: 'white' }}>{props.text2}</Text>}
    </View>
  ),
  warning: ({ text1, props }) => (
    <View style={{ backgroundColor: '#ffbb33', padding: 16, borderRadius: 8 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
      {props.text2 && <Text style={{ color: 'white' }}>{props.text2}</Text>}
    </View>
  ),
};

export { toastConfig };