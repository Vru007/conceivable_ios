import React,{useContext, useState}from 'react';
import { View, Text, Pressable, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { AuthContext } from '../../context/authContext';
import { useRouter, useRootNavigationState } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Video } from 'expo-av';
import { usePlaybackState } from 'expo-av/build/Audio';

const CreatorProfile = () => {

 const { handleLogout,user } = useContext(AuthContext);
 const router = useRouter();
  const videoUrl = 'https://conceivable-dashboard-node-goz8l.ondigitalocean.app/streams/tongueAnalysis/video';
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = React.useRef(null);
  const handlePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isPlaying) {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-[#011F25]">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Profile Card */}
        <View className="flex-1 bg-[#011F25] items-center justify-center p-1">
      {/* Profile Card */}
      <View className="bg-[rgba(0,151,160,0.1)] rounded-lg p-4 border border-[#0097A0]">
        {/* Profile Image and Name */}
        <View className="flex-row items-center mb-3">
          <Image
            source={require('../../assets/creator.png')} // Replace with the actual profile image URL
            className="w-16 h-16 rounded-full mr-3"
          />
          <View>
            <Text className="text-xl font-bold text-[#f5138f]">Kirsten Karchmer</Text>
            <Text className="text-white mt-2">@Kirsten Karchmer</Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-white mt-2 mb-4">
          Kristen Karchmer is the founder and CEO of Conceivable. With over 20
          years of experience in fertility and wellness, Kristen is dedicated to
          helping individuals achieve optimal health and conceive naturally.
        </Text>

        {/* Connect Button */}
        <View className="flex-1 items-center">
        <TouchableOpacity className="bg-[#ED5CAB] rounded-lg py-4 px-2 items-center">
          <Text className="text-white font-bold">Connect With Kristen</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
    <View>
      <Text className="text-white text-xl mt-4 mb-3 font-semibold">Watch Now</Text>
      <View className="w-full h-72 mb-4 bg-black">
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
        useNativeControls={true}
        shouldPlay={false} // Prevents autoplay
      />

      {!isPlaying && (
        <Pressable
          onPress={handlePlayPause}
          className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <Text className="text-white text-2xl">Play</Text>
        </Pressable>
      )}
    </View>
    <View className="w-full h-72 mb-4 bg-black">
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
        useNativeControls={true}
        shouldPlay={false} // Prevents autoplay
      />

      {!isPlaying && (
        <Pressable
          onPress={handlePlayPause}
          className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <Text className="text-white text-2xl">Play</Text>
        </Pressable>
      )}
    </View>
    <View className="w-full h-72 mb-4 bg-black">
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
        useNativeControls={true}
        shouldPlay={false} // Prevents autoplay
      />

      {!isPlaying && (
        <Pressable
          onPress={handlePlayPause}
          className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <Text className="text-white text-2xl">Play</Text>
        </Pressable>
      )}
    </View>
    </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatorProfile;
