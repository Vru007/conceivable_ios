import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

const DrawerContent = (props) => {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}
    contentContainerStyle={{ flex: 1, backgroundColor: '#011F25' }}>
      <View className="flex-1 p-4 bg-[#011F25]">
        <TouchableOpacity
          className="py-2"
          onPress={() => router.push('(tabs)/home')}
        >
          <Text className="text-lg text-white">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-2"
          onPress={() => router.push('(profile)/profile')}
        >
          <Text className="text-lg text-white">Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-2"
          onPress={() => router.push('(community)/community')}
        >
          <Text className="text-lg text-white">Community</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-2"
          onPress={() => router.push('(diffroute)/toungeAnalysis')}
        >
          <Text className="text-lg text-white">Tounge Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-2"
          onPress={() => router.push('(diffroute)/pastMacros')}
        >
          <Text className="text-lg text-white">Past Macros</Text>
        </TouchableOpacity>
        {/* Add more drawer items as needed */}
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
