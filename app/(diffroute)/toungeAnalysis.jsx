import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Image, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { Camera, CameraType } from 'expo-camera/legacy';
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
const TongueAnalysis = () => {
  // const host = "https://15n7k2b8-3000.inc1.devtunnels.ms";
  const host="https://conceivable-dashboard-node-goz8l.ondigitalocean.app"
  const { currentuser } = useContext(AuthContext);
  
  const [status, setStatus] = useState({});
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [type, setType] = useState(CameraType.front);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCameraOpen = () => {
    if (hasPermission) {
      setIsCameraOpen(true);
    } else {
      alert("Camera access is required to capture images.");
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
      });
      
      // console.log("tounge photo:",photo);
      setCapturedImage(photo);
      setIsCameraOpen(false);
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Failed to take picture. Please try again.');
    }
  };

  const handleUploadImage = async () => {
    if (!capturedImage) return;

    setIsGenerating(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: capturedImage.uri,
        type: 'image/jpeg',
        name: `${currentuser.name.split(' ')[0]}.jpeg`
      });
     
      
const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(`${host}/api/upload-tongue-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth-token': token,
          'Access-Control-Allow-Origin': '*',
        }
      });

      setResult(response.data.analysis);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
    setIsGenerating(false);
  };

  const formatResult = (message) => {
    if (!message) return null;
    
    return message.split('\n').map((line, index) => (
      <Text key={index} style={{ marginBottom: 5 }} className="text-gray-900">
        {line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text key={i} className="font-bold">
                {part.slice(2, -2)}
              </Text>
            );
          }
          // Ensure empty strings don't cause issues
          return part ? <Text key={i}>{part}</Text> : null;
        })}
      </Text>
    ));
  };

  const CameraComponent = () => (
    <Modal
      visible={isCameraOpen}
      animationType="slide"
      onRequestClose={() => setIsCameraOpen(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {hasPermission ? (
          <Camera
            ref={cameraRef}
            type={type}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View className="p-4">
                  <Text className="text-white text-lg text-center">
                    Position your tongue in the center
                  </Text>
                </View>

                <View className="flex-row justify-between items-center p-4 mb-4">
                  <TouchableOpacity
                    className="w-[70px] h-[70px] bg-white/30 rounded-full items-center justify-center"
                    onPress={() => setIsCameraOpen(false)}
                  >
                    <Feather name="x" size={24} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className="w-[70px] h-[70px] bg-white rounded-full items-center justify-center"
                    onPress={takePicture}
                  >
                    <Feather name="camera" size={24} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="w-[70px] h-[70px] bg-white/30 rounded-full items-center justify-center"
                    onPress={() => setType(
                      type === CameraType.front ? CameraType.back : CameraType.front
                    )}
                  >
                    <Feather name="refresh-ccw" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Camera>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg">No access to camera</Text>
          </View>
        )}
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#011F25]">
      <ScrollView className="flex-1 p-4 mb-4">
        <View className="space-y-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-pink-500 text-2xl font-bold">
              Tongue Analysis
            </Text>
          </View>

          {/* Captured Image Display */}
          {capturedImage && (
            <View className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <Image
                source={{ uri: capturedImage.uri }}
                className="flex-1"
                resizeMode="contain"
              />
            </View>
          )}

          {/* Video Player Section (when no image) */}
          {!capturedImage && (
            <View className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <Video
                className="flex-1"
                source={{ uri: 'YOUR_VIDEO_URL_HERE' }}
                useNativeControls
                resizeMode="contain"
                onPlaybackStatusUpdate={setStatus}
              />
            </View>
          )}

          {/* Action Buttons */}
          {capturedImage ? (
            <View className="flex-row space-x-2">
              <TouchableOpacity 
                className="flex-1 bg-red-500 py-3 rounded-lg flex-row justify-center items-center"
                onPress={() => setCapturedImage(null)}
              >
                <Text className="text-white text-lg">Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-[#00979A] py-3 rounded-lg flex-row justify-center items-center"
                onPress={handleUploadImage}
              >
                <Text className="text-white text-lg">Analyze</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              className="bg-[#00979A] py-3 rounded-lg flex-row justify-center items-center space-x-2"
              onPress={handleCameraOpen}
            >
              <Feather name="camera" size={24} color="white" />
              <Text className="text-white text-lg">Take Picture</Text>
            </TouchableOpacity>
          )}

          {/* Analysis Results - Removed fixed height */}
          {(result || isGenerating) && (
            <View className="bg-[#d9fdff] p-4 rounded-lg">
              <Text className="text-lg font-semibold text-gray-900 border-b-2 border-black w-fit">
                Result
              </Text>
              <View className="mt-2">
                {isGenerating ? (
                  <View className="justify-center items-center py-4">
                    <ActivityIndicator size="large" color="#FF69B4" />
                    <Text className="text-gray-600 mt-2">Analyzing your tongue...</Text>
                  </View>
                ) : (
                  <View className="pb-4">
                    {formatResult(result)}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Instructions Card */}
          <View className="bg-[rgba(0,151,160,0.1)] p-4 rounded-lg">
            <Text className="text-white text-lg font-semibold mb-3">
              Step-by-Step Guide to Tongue Analysis
            </Text>
            <Text className="text-gray-300 mb-3">
              To get the most accurate results from your tongue analysis, follow these simple steps
            </Text>
            
            <View className="space-y-2">
              {[
                'Find Good Lighting',
                'Stick Out Your Tongue',
                'Capture Details',
                'Review the Analysis'
              ].map((instruction, index) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#00979A]" />
                  <Text className="text-gray-300">{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Camera Modal */}
      {isCameraOpen && <CameraComponent />}
    </SafeAreaView>
  );
};

export default TongueAnalysis;