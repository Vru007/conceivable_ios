import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

const pastMacros = () => {
  const [macros, setAllMacros] = useState([]);
  const host = "https://conceivable-dashboard-node-goz8l.ondigitalocean.app"

  const fetchMacros = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const response = await axios.get(`${host}/api/fetch-all-macros`, {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
    });
    console.log("get-macros data: ", response.data)
    setAllMacros(response.data.allMacros);
  }

  useEffect(() => {
    fetchMacros()
  }, []);

  return (
    <View className="flex-1 bg-[#011F25] px-4 py-6">
      {console.log("macros of state: ", macros)}
      <ScrollView className="pb-6 flex-1">
        {macros.map((macro, index) => (
          <View style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} key={index} className="rounded-lg mb-4 flex-row overflow-hidden">
            
            <View className="flex-1 p-4">
              <Text className="text-white font-bold text-base mb-2">{macro.name}</Text>
              <View className="flex-row flex-wrap">
                <View className="flex-row items-center mr-4 mb-2">
                  <Feather name="clock" size={16} color="#A0A0A0" />
                  <Text className="text-[#A0A0A0] text-sm ml-2">{format(new Date(macro.uploadedAt), 'MMM d, yyyy - h:mm a')}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Feather name="compass" size={16} color="#A0A0A0" />
                  <Text className="text-[#A0A0A0] text-sm ml-2">Calories: {macro.calories}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Feather name="book" size={16} color="#A0A0A0" />
                  <Text className="text-[#A0A0A0] text-sm ml-2">Carbs: {macro.carbs}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Feather name="droplet" size={16} color="#A0A0A0" />
                  <Text className="text-[#A0A0A0] text-sm ml-2">Fats: {macro.fat}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                  <Feather name="star" size={16} color="#A0A0A0" />
                  <Text className="text-[#A0A0A0] text-sm ml-2">Proteins: {macro.protein}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default pastMacros;