import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-row justify-between items-center bg-[#011F25] pt-8 px-5">
      {/* Left Icon - Drawer Toggle */}
      <TouchableOpacity
        style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
        className="p-2 rounded-lg"
        onPress={() => navigation.openDrawer()}
      >
        <MaterialIcons name="menu" size={24} color="white" />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require('../assets/light-header.png')}
        style={{ width: 170, height: 25 }}
        resizeMode="contain"
      />

      {/* Right Icon */}
      <TouchableOpacity
        style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
        className="p-2 rounded-lg"
      >
        <Entypo name="dots-three-vertical" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Header;