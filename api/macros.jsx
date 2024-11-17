import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://conceivable-dashboard-node-goz8l.ondigitalocean.app';

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (err) {
    console.log("err: ", err);
    return null;
  }
};

const getHeaders = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'multipart/form-data',
    'auth-token': token
  };
};

export const fetchFromImage = async (imageUri) => {
  try {
    // Create form data properly
    const formData = new FormData();
    formData.append('macroImage', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'food-image.jpeg'
    });

    const headers = await getHeaders();
    
    const response = await axios.post(
      `${API_URL}/api/upload-macros-image`,
      formData,
      { headers: headers }
    );

    console.log("macros response: ", response);
    return response.data;
  } catch (err) {
    console.error("Error uploading image:", err);
    alert("Image upload failed. Please try again.");
    throw err;
  }
};