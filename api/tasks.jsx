// api/tasks.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://conceivable-dashboard-node-goz8l.ondigitalocean.app'; 


const getToken=async()=>{
   try{
    
      return await AsyncStorage.getItem('authToken')
   }
   catch(err){
    console.log("err: ",err);
    return null;
   }
}  
 
 const getHeaders = async () => {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'auth-token': token
    };
  };
  
export const updateTask = async (taskId, isDone) => {
  try {
    const headers=await getHeaders();
    const response = await axios.post(`${API_URL}/api/auth/updateTasks`, 
      {taskId:taskId},
      {headers:headers}
    );
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const updateTemperatureTask = async (temperature) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/updateTasks`, {
      taskId: 0, 
    //   isDone: true,
    //   temperature
    });
    return response.data;
  } catch (error) {
    console.error('Error updating temperature task:', error);
    throw error;
  }
};