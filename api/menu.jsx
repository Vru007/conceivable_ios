import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getMenu=async()=>{

    try{
    const token = await AsyncStorage.getItem('authToken'); 
    const response=await axios.get("https://conceivable-dashboard-node-goz8l.ondigitalocean.app/api/get-menu",{
        headers:{
            "Content-Type":"application/json",
            "auth-token":token
        }
    });
   
    const data=response.data;
    console.log("get-Menu: ",data);
    console.log("menu Plan: ",data.menuPlan.createdAt)
    // const Reciperesponse=await axios.get("https://conceivable-dashboard-node-goz8l.ondigitalocean.app/api/get-recipes",{
    //     headers:{
    //         "Content-Type":"application/json",
    //         "auth-token":token
    //     }
    // });
    // const recipedata=Reciperesponse.data;
    // console.log("get-recipes: ",recipedata);
    // console.log("recipe-data: ",recipedata.recipes.afternoon_snack_d1.recipe);
    return data;
}
catch(err){
   
    console.error(err);
    throw err;
}
}

export const getRecipe=async()=>{
    try{
        const token = await AsyncStorage.getItem('authToken');
        const response=await axios.get('https://conceivable-dashboard-node-goz8l.ondigitalocean.app/api/get-recipes',{
            headers:{
             "Content-Type":"application/json",
             "auth-token":token
            }

        });
        const data=response.data;
        console.log("response from get-recipe: ",data);
        // console.log("recipe-data: ",data.recipes.afternoon_snack_d1.recipe);
        return data;

    }

    catch(err){
        console.log(err);
        throw new Error(err);
    }
}