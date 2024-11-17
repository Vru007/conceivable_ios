import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getScores=async()=>{

    try{
    const token = await AsyncStorage.getItem('authToken'); 
    const response=await axios.get("https://conceivable-dashboard-node-goz8l.ondigitalocean.app/api/get-scores",{
        headers:{
            "Content-Type":"application/json",
            "auth-token":token
        }
    });

    const data=response.data;
    console.log("get-scores: ",data);
    return data;
}
catch(err){
   
    console.error(err);
    throw err;
}
}