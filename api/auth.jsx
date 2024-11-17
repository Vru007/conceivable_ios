import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://conceivable-dashboard-node-goz8l.ondigitalocean.app',
});

api.interceptors.request.use(async (config) => {
  
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
     console.log("token exists: ");
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = async (userData) => {
  console.log("userData inside api: ",userData);
  const response = await api.post('/api/app/signup', userData);
  console.log("signup data: ",response);
  console.log("Data: ",response.data);
  return {data:response.data,status:response.status};
};

export const login = async (credentials) => {

  // console.log("credentials: ",credentials);

  const response = await api.post('/api/auth/login', credentials);
  const data=response.data;
  console.log("Res: ",data);
  if (data.authToken) {
    await AsyncStorage.setItem('authToken', data.authToken);
    const userData=await getUser();
    return{...data,user:userData};
  }
  return data;
};

export const getUser = async () => {
  try {
    
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      console.log('No token found');
      return;
    }

    const response = await api.post(`/api/auth/get-user`, {},{
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token, // Use the token from AsyncStorage
      },
    });

    const data = response.data;
    // console.log("data in api: ",data);
    
    return data;
    // if (data.error) {
    //   await AsyncStorage.removeItem('authToken'); // Clear AsyncStorage if there's an error
    //   console.log('Error fetching user, logging out...');
    //   // we can implement navigation to a login screen here if required
    // } else {
    //   setUser(data);
    // }
  } catch (error) {
    console.error('Error fetching user', error);
  }
};
export const logout = async () => {
  await AsyncStorage.removeItem('authToken');
};

export const verifyOTP = async (otp) => {
  try{
  console.log("otp inside api: ",otp);
  const response = await api.post('/api/app/verify-otp',otp);
  console.log("whole response: ",response);
  console.log("only data of response: ",response.data);
  // return response.data;
  }catch(error){
    console.log(error);
    throw new Error(error);
  }
};

export const connectRing =async()=>{
  const data=true;
  return data;
}