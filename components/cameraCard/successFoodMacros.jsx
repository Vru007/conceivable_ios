import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SuccessModal = ({ visible, onClose, data }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#1D1D1D', borderRadius: 10, padding: 20, width: '80%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Macros Analysis</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {data !==null && (
            <>
          <View style={{ marginVertical: 8 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Name: {data.name}</Text>
          </View>
          <View style={{ marginVertical: 8 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Calories: {data.calories}</Text>
          </View>
          <View style={{ marginVertical: 8 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Carbs: {data.carbs}</Text>
          </View>
          <View style={{ marginVertical: 8 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Protein: {data.protein}</Text>
          </View>
          <View style={{ marginVertical: 8 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Fat: {data.fat}</Text>
          </View>
          </>)}
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;