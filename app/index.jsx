import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function App() {
  const [progress, setProgress] = useState(30);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
  
  const router = useRouter();
  const { isAuthenticated, loading, ring } = useContext(AuthContext);

  const texts = [
    ["You aren't fertile or infertile...", "You are somewhere in between."],
    ["There are more than 50 like you."],
    ["Kirsten AI is here to help you discover the underlying issues and work with you 24/7 to repair them."],
  ];

  const homeScreen = () => {
    router.push('/sign-in');
  };

  const nextScreen = () => {
    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(prev => prev + 1);
      setProgress(prev => Math.min(prev + 30, 100));
    } else {
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      if (!loading) {
        setIsChecking(true);
        try {
          // Artificial delay of 2 seconds
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          if (isAuthenticated && ring) {
            router.navigate('/home');
          } else if (isAuthenticated && !ring) {
            router.navigate('/ring');
          }
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkAuthAndNavigate();
  }, [isAuthenticated, loading, ring]);

  useEffect(() => {
    if (progress >= 100) {
      homeScreen();
    }
  }, [progress]);

  if (isChecking) {
    return (
      <View className="flex-1 bg-[#011F25] justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Checking authentication...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#011F25]">
    
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ImageBackground
        source={require('../assets/blur.png')} 
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} 
        resizeMode="cover" e
      >
      
        <View className="flex-1 justify-center items-center px-5 mt-10">
          
            <View className="w-full flex-row justify-between items-center p-5 z-10">
              <View className="w-4/5 h-1 bg-neutral-900 rounded-full">
                <View
                  className="h-1 bg-white rounded-full"
                  style={{ width: `${progress}%` }} 
                />
              </View>

              <TouchableOpacity onPress={nextScreen}>
                <Text onPress={homeScreen} className="text-lg text-white">Skip</Text>
              </TouchableOpacity>
            </View>

            {/* Main Text */}
            <View className="flex-1 justify-center items-left z-10">
              {texts[currentTextIndex].map((line, index) => (
                <Text key={index} className="text-white text-3xl font-semibold mb-10">
                  {line}
                </Text>
              ))}
            </View>

            {/* Arrow Button at the bottom-right */}
            <TouchableOpacity
              onPress={nextScreen}
              className="bg-pink-400 p-3 rounded-xl absolute bottom-5 right-5 z-10"
            >
              <Text className="text-4xl font-bold text-white">→</Text>
            </TouchableOpacity>
         
        </View>
        
      </ImageBackground>
      </ScrollView>
    
    </SafeAreaView>
  );
}
