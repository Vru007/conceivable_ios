import axios from 'axios';
const API_URL='https://15n7k2b8-3000.inc1.devtunnels.ms/'

const api = axios.create({
  baseURL: API_URL,
});

export const getActiveRooms = async () => {
  try {
    const response = await api.get('/rooms/active');
    console.log("response of active rooms: ",response);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch active rooms:', error);
    throw error;
  }
};
