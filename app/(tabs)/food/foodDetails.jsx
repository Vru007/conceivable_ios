import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator,Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getRecipe } from '../../../api/menu';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
// Placeholder data (to be replaced with API calls)
const ingr = [
  { name: 'Almond Milk', amount: '16.34 FL OZ' },
  { name: 'Protein Powder', amount: '1 scoop' },
  { name: 'Oats', amount: '1/2 cup' },
];

const inst = [
  'Boil water in a pot',
  'Add oats and simmer for 5 minutes',
  'Stir in almond milk and protein powder',
];

const detailsData = {
  nutrition: {
    carbs: '30g',
    protein: '20g',
    fats: '10g',
  },
  dietaryFiber: '5g',
};


const FoodDetails = () => {
  const router = useRouter();
    const { title, description, duration, imageUrl,currentDay } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Ingredients');
  const [recipeData, setRecipeData] = useState(null);
  const [recipeKey, setRecipeKey]=useState(null);
  const [shoppingList, setShoppingList]=useState(null);
  const [ingredientsData, setIngredientsData]=useState(null);
  const [instructionsData, setinstructionsData]=useState(null);
  // console.log("imageUrl: ",imageUrl);
   
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Consolidated state for recipe details
  const [recipeDetails, setRecipeDetails] = useState({
    recipeData: null,
    ingredientsData: null,
    instructionsData: null,
    shoppingList:null,
  });

  // Memoized meal type mapping to prevent unnecessary re-renders
  const mealTypeMap = React.useMemo(() => ({
    'Breakfast': `breakfast_d${currentDay}`,
    'Lunch': `lunch_d${currentDay}`,
    'Dinner': `dinner_d${currentDay}`,
    'Morning Snack': `am_snack_d${currentDay}`,
    'Afternoon Snack': `afternoon_snack_d${currentDay}`,
  }), [currentDay]);

  // Centralized data processing function
  const processRecipeData = useCallback((recipes, key) => {
    const newKey=key;
    if (!recipes || !recipes[newKey]) {
      throw new Error(`Recipe with key ${newKey} not found.`);
    }
    
    
    const currentRecipe = recipes[newKey].recipe || {};
   
    console.log("currentRecipe: ",currentRecipe);
    const temp= {
      recipeData: currentRecipe,
      ingredientsData: currentRecipe.ingredients 
        ? currentRecipe.ingredients.split(',').map(item => item.trim())
        : [],
      instructionsData: currentRecipe.instructions 
        ? currentRecipe.instructions.split('.').map(step => step.trim()).filter(Boolean)
        : [],
        shoppingList:currentRecipe.shopping_list
    };

    return temp;
  }, []);

  // Consolidated fetch function with comprehensive error handling
  const fetchRecipeData = useCallback(async () => {
    try {
      // Reset states
      setIsLoading(true);
      setError(null);

      // Fetch recipe
      const response = await getRecipe();
      
      // Determine recipe key
      const recipeKey = mealTypeMap[title];
      
      if (!recipeKey) {
        throw new Error(`Invalid meal type: ${title}`);
      }

      // Process recipe data
      const processedData = processRecipeData(response.recipes, recipeKey);
      
      // Update state with processed data
      setRecipeDetails(processedData);
      
    } catch (err) {
      console.error("Error fetching recipe data", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [title, mealTypeMap, processRecipeData]);

  // Primary useEffect to trigger data fetching
  useEffect(() => {
    fetchRecipeData();
  }, [fetchRecipeData]);


  

  // const handlePurchase = () => {
  //   router.push({
  //     pathname: '/food/shoppinglist',
  //     params: {
  //       ingredients: JSON.stringify(shoppingList)
  //     }
  //   });
  // };
   
  const handlePurchase = async () => {
    try {
      // Parse the shopping list
      console.log("recipe me shopping List: ",recipeDetails.shoppingList);
      const shoppingListArray = recipeDetails.shoppingList.split(', ');
      console.log("shopping Array: ",shoppingListArray);
      const ingredients = shoppingListArray.map(item => {
        // Improved regex to handle items with and without quantities
        const match = item.match(/^(.*?)(?:\s+(\d+\s*\w+))?$/);
        
        if (!match) {
          // Fallback if regex fails completely
          return {
            name: item.trim(),
            quantity: 'As needed'
          };
        }
  
        return {
          name: match[1] ? match[1].trim() : item.trim(),
          quantity: match[2] ? match[2].trim() : 'As needed'
        };
      });
  
      // Create HTML template for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                max-width: 600px; 
                margin: 0 auto; 
              }
              h1 { 
                color: #333; 
                text-align: center; 
                border-bottom: 2px solid #333; 
                padding-bottom: 10px; 
              }
              ul { 
                list-style-type: none; 
                padding: 0; 
              }
              li { 
                padding: 10px; 
                border-bottom: 1px solid #eee; 
                display: flex; 
                justify-content: space-between; 
              }
              .quantity { 
                color: #666; 
                margin-left: 20px; 
              }
            </style>
          </head>
          <body>
            <h1>Shopping List</h1>
            <ul>
              ${ingredients.map(item => `
                <li>
                  <span>${item.name}</span>
                  <span class="quantity">${item.quantity}</span>
                </li>
              `).join('')}
            </ul>
          </body>
        </html>
      `;
  
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
  
      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        // Share the PDF
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share your shopping list',
          UTI: 'com.adobe.pdf'
        });
      } else {
        // Fallback for platforms that don't support sharing
        Alert.alert(
          'Download Unavailable', 
          'Sharing is not supported on this device.'
        );
      }
  
    } catch (error) {
      console.error('Error creating shopping list PDF:', error);
      Alert.alert(
        'Error', 
        'Failed to create shopping list. Please try again.'
      );
    }
  };
 

  // useEffect(() => {
  //   const fetchRecipeData = async () => {
  //     try {
  //       const response = await getRecipe();
  //       console.log("get-recipe-response in front: ",response);
  //       const recipes = response.recipes;
        
  //       // Check if the specific recipe key exists in the data
  //       const tempkey=await mealTypeMap[title];
  //       const t=await setRecipeKey(tempkey);

  //       console.log("recipeKey: ",recipeKey);
  //       if (recipes && recipes[recipeKey]) {
          
  //         const currentrecipe = recipes[recipeKey].recipe || {};
  //         console.log("recipe in useSTATE: ",currentrecipe);
  //         await setRecipeData(currentrecipe);

  //         console.log("RecipreData: ",recipeData);
  //         const tempingredientsData = recipeData.ingredients ? recipeData.ingredients.split(',').map(item => item.trim()) : [];
  //         setIngredientsData(tempingredientsData);
  //         // Split the instructions by periods, trim extra spaces, and filter out any empty strings
  //         const tempinstructionsData = recipeData.instructions ? recipeData.instructions.split('.').map(step => step.trim()).filter(Boolean):[];
  //         setinstructionsData(tempinstructionsData);

  //         console.log("instructionData: ",instructionsData);
  //         console.log("ingredientsData: ",ingredientsData);
  //       } else {
  //         console.warn(`Recipe with key ${recipeKey} not found.`);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching recipe data", error);
  //     }
  //   };
  //   fetchRecipeData();
  // }, [recipeKey]);

  const Loader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading Recipe Details...</Text>
    </View>
  );

  const ErrorDisplay = () => (
    <View style={styles.loaderContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <TouchableOpacity onPress={fetchRecipeData} style={styles.retryButton}>
        <Text>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Ingredients':
        return (
            <View className='w-11/12'>
            <View className="flex justify-items-center">
            {recipeDetails.ingredientsData.map((item, index) => (
                <View key={index}>
              <Text className="text-white text-sm mb-5 ml-5">
                {item}
              </Text>
              <View className="border-b border-white mx-5" />
              </View>
            ))}

            <TouchableOpacity  onPress= {()=>handlePurchase()} className='flex-row mt-5 items-center bg-[#003B45] ml-4 border border-[#D9FDFF] py-2 px-4 rounded-lg w-1/4'><Text className='text-white'>Buy Items</Text></TouchableOpacity>
          </View>
          </View>

        );
      case 'Instructions':
        return (
          <View className="mt-4">
            {recipeDetails.instructionsData.map((item, index) => (
                <View key={index} className="mb-2">
                { index%2!=0 ?
                <Text className="text-white text-base mb-2 ml-5">
                  {(index+1)/2}. {item}
                </Text>
                :null
                }
                {/* Horizontal Line */}
                
              </View>
            ))}
          </View>
        );
      case 'Details':
        return (
            
          <View className="mt-4">
            <View className="flex-row justify-around ">
              {Object.entries(detailsData.nutrition).map(([key, value]) => (
                <View key={key} className=" w-1/4 bg-[rgba(0, 151, 160, 0.1)] p-3 rounded-lg items-center">
                  <Text className="text-gray-400 text-sm uppercase">{key}</Text>
                  <Text className="text-white text-lg font-bold mt-1">{value}</Text>
                </View>
              ))}
            </View>
            <View className="flex-row justify-between mt-6 mx-5 pt-4 border-t border-gray-600">
              <Text className="text-white text-base">Dietary Fiber</Text>
              <Text className="text-white text-base font-bold">{detailsData.dietaryFiber}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#011F25]">
   
    <View className='mb-5'>
      <Image source={require('../../../assets/detail.png')} className="w-full h-72" />
      
      <View className="flex-row justify-center absolute top-60 left-0 right-0">
      <View className="w-[335px] h-[99px] p-2 flex-row justify-around items-center bg-[#012B31] rounded-lg">
      <View className="mr-3">
        <TouchableOpacity className="flex-row items-center justify-center bg-[#ED5CAB] w-[148px] h-[38px] rounded-lg">
          <Text className="text-white font-bold text-base">I ate this!</Text>
        </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity className="flex-row items-center justify-center bg-[#0097A0] w-[148px] h-[38px] rounded-lg">
          <Ionicons name="camera-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">What I ate</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
    <View className='flex-1 items-center justify-center'>
      <View className='w-11/12'>
      <View className='mt-5'>
      <Text className="text-white text-2xl font-bold mt-10 ml-5">{title}</Text>
      <Text className="text-gray-400 text-base mt-2 ml-5">{description}</Text>
      <Text className="text-gray-400 text-sm mt-1 ml-5">{duration}</Text>
      </View> 
      <View className="flex-row justify-around mt-6 border-b border-gray-600">
        {['Ingredients', 'Instructions', 'Details'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`pb-2 ${activeTab === tab ? 'border-b-2 border-pink-500' : ''}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-xs text-base ${activeTab === tab ? 'text-pink-500 font-bold' : 'text-gray-400'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className='mt-2'>
      {isLoading ? <Loader /> : 
       error ? <ErrorDisplay /> : 
      renderContent()}
      </View>
      </View>
      </View>
      </View>
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
 
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});
export default FoodDetails;