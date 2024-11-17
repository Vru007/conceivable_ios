// app/tabs/food/RecipeCard.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons
import { useRouter } from 'expo-router';

const RecipeCard = ({ title, description, duration, imageUrl,currentDay }) => {
 
  const router = useRouter();
  const handleNavigate = ({ title, description, duration, imageUrl }) => {
    // navigation.navigate('FoodDetailPage', { title, description, duration, imageUrl });
    router.push({
      pathname: '/food/foodDetails',
      params: { 
        title:title, 
        description:description, 
        duration:duration, 
        imageUrl:imageUrl,
        currentDay:currentDay
      }
    });
  };

  return (
    <TouchableOpacity onPress={()=>handleNavigate({ title, description, duration, imageUrl })}>
    <View style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} className="flex-row rounded-lg mb-3 overflow-hidden items-center">
      <View className='w-20 h-20 justify-center items-center '>
        <Image source={imageUrl} className="w-16 h-16 rounded-full" />
      </View>
      <View className="flex-1 p-3">
        <Text className="text-white text-base font-bold mb-1">{title}</Text>
        <View className="flex-row">
          <Text className="text-gray-400 text-sm mb-1 w-4/5" numberOfLines={2}>
            {description}
          </Text>
          <TouchableOpacity className='mx-5' onPress={()=>handleNavigate({ title, description, duration, imageUrl })}>
            <Ionicons color="#0097A0" name="chevron-forward" size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#888" />
          <Text className="text-gray-500 text-sm ml-1">{duration}</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;
