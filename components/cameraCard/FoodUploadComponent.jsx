import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ActivityIndicator, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/authContext';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import SuccessModal from './successFoodMacros';
// Configuration for different environments
const getApiUrl = () => {
  if (__DEV__) {
    // For Android emulator, localhost needs to be 10.0.2.2
    // For iOS simulator, localhost works fine
    return Platform.select({
      ios: 'http://localhost:5000',
      android: 'http://10.0.2.2:5000',
      // If you're testing on a physical device, use your local IP address
      // default: 'http://192.168.1.XXX:5000'
    });
  }
  return 'https://conceivable-dashboard-node-goz8l.ondigitalocean.app';
};

const TrackingCard = ({ title, value, unit, icon, onImageCaptured }) => {
  // const host = getApiUrl();
  const host="https://conceivable-dashboard-node-goz8l.ondigitalocean.app";
  const { currentuser } = useContext(AuthContext);
  
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (title === 'Food') {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, [title]);

  const handleCameraOpen = () => {
    if (hasPermission) {
      setIsCameraOpen(true);
    } else {
      alert("Camera access is required to capture images.");
    }
  };

  const saveImage = async (uri) => {
    try {
      const directory = `${FileSystem.documentDirectory}images/`;
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      const filename = `macro_${new Date().getTime()}.jpg`;
      const newUri = `${directory}${filename}`;

      await FileSystem.copyAsync({
        from: uri,
        to: newUri
      });

      return newUri;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
      });
      
      const savedUri = await saveImage(photo.uri);
      setCapturedImage({ ...photo, uri: savedUri });
      setIsCameraOpen(false);
      
      if (onImageCaptured) {
        onImageCaptured(savedUri, title.toLowerCase());
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Failed to take picture. Please try again.');
    }
  };

  const handleUploadImage = async () => {
    if (!capturedImage) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Verify file exists
      const fileInfo = await FileSystem.getInfoAsync(capturedImage.uri);
      if (!fileInfo.exists) {
        throw new Error('Image file not found');
      }

      // Create the form data
      const formData = new FormData();
      
      // Create file object
      const file = {
        uri: capturedImage.uri,
        type: 'image/jpeg',
        name: 'macro_image.jpg',
      };

      formData.append('macroImage', file);

      // Get auth token
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Upload attempt to:', host);
      console.log('Token:', token);

      // Add timeout and retry logic
      const axiosConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth-token': token,
          'Accept': 'application/json'
        },
        timeout: 30000, // 30 second timeout
      };

      const response = await axios.post(
        `${host}/api/upload-macros-image`,
        formData,
        axiosConfig
      );

      console.log('Upload successful:', response.data);
      
      // Clean up
      await FileSystem.deleteAsync(capturedImage.uri).catch(console.error);
      
      setCapturedImage(null);
      setSuccessData(response.data.analysis.macro);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Upload failed:', error);
      let errorMessage = 'Upload failed. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please check your connection.';
      } else if (error.response) {
        errorMessage += error.response.data.message || 'Server error.';
      } else if (error.request) {
        errorMessage += 'Cannot connect to server. Please check your connection and server status.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      setUploadError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTrackPress = () => {
    if (title === 'Temperature') {
      router.navigate('/(diffroute)/temptrack');
      
    } else {
      handleCameraOpen();
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
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
                    Position your food in the center
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
    <View className="w-full flex-row items-center">
      <View 
        style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} 
        className="pl-1 rounded-lg h-[65px] mb-[20px] flex-row items-center"
      >
        <View 
          style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} 
          className="w-1/5 ml-1 rounded-lg h-[50px] items-center justify-center"
        >
          {icon}
        </View>

        <View className="w-4/5 pl-4 flex-row items-center justify-between">
          <View className="flex-col">
            <Text className="text-[#A0A0A0] text-sm">{title}</Text>
            <Text className="text-white text-xl font-semibold">
              {value}
              {unit}
            </Text>
            {capturedImage && title === 'Food' && (
              <View>
                <Text className="text-[#0097A0] text-xs">Image captured</Text>
                {isUploading && (
                  <ActivityIndicator size="small" color="#0097A0" />
                )}
              </View>
            )}
          </View>
          <View className="px-5">
            {capturedImage && title === 'Food' ? (
              <View className="flex-row space-x-2">
                <TouchableOpacity 
                  className="bg-red-500 rounded-lg h-[38px] px-3 flex-row items-center justify-center"
                  onPress={() => {
                    setCapturedImage(null);
                    setUploadError(null);
                  }}
                >
                  <Text className="text-white text-sm">Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-[#0097A0] rounded-lg h-[38px] px-3 flex-row items-center justify-center"
                  onPress={handleUploadImage}
                  disabled={isUploading}
                >
                  <Text className="text-white text-sm">
                    {isUploading ? 'Uploading...' : 'Analyze'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                className="bg-[#0097A0] rounded-lg h-[38px] w-[130px] flex-row items-center justify-center"
                onPress={handleTrackPress}
              >
                {title === 'Food' && (
                  <Feather name="camera" size={16} color="white" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white text-sm">Track Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {uploadError && (
        <Text className="text-red-500 text-xs mt-1">{uploadError}</Text>
      )}

      {/* Camera Modal */}
      {title === 'Food' && isCameraOpen && <CameraComponent />}

      <SuccessModal
        visible={showSuccessModal}
        onClose={handleCloseModal}
        data={successData}
      />
    </View>
  );
};

// TrackingCards component
const TrackingCards = ({ onImageCaptured }) => {
  return (
    <View className="w-full">
      <TrackingCard
        title="Temperature"
        value="97.2"
        unit="°F"
        icon={
          <Image
            source={require("../../assets/temp.png")}
            style={{ width: 35, height: 35 }}
          />
        }
        onImageCaptured={onImageCaptured}
      />
      <TrackingCard
        title="Food"
        icon={
          <Image
            source={require("../../assets/food.png")}
            style={{ width: 30, height: 30 }}
          />
        }
        onImageCaptured={onImageCaptured}
      />
    </View>
  );
};

export { TrackingCard, TrackingCards };