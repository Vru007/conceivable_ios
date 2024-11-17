import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const shoppinglist = () => {
    const { ingredients } = useLocalSearchParams();
  const parsedIngredients = JSON.parse(ingredients);
  const { width } = Dimensions.get('window');
  // console.log("parsedIngredient: ",parsedIngredients);
  return (
    
    <SafeAreaView className="flex-1 bg-[#011F25]">
    <View className="h-full bg-[#011F25]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-2 mt-5 h-100hv bg-[#011F25]">
          {parsedIngredients.map((ingredient, index) => (
            <View
              key={index}
              style={{backgroundColor:'[rgba(0,151,160,0.1)]'}}
              className="flex-row rounded-lg mb-3 overflow-hidden items-center"
            >
              <View className="w-20 h-20 justify-center items-center">
                <Image
                  source={require('../../../assets/Milk.png')}
                  className="w-16 h-16 rounded-full"
                />
              </View>
              <View className="flex-1 p-3 flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-base font-bold mb-1">
                    {ingredient.name}
                  </Text>
                  <View className="flex-row items-center">
                  </View>
                </View>
                <Text className="text-white text-sm font-bold">
                  {ingredient.amount}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
            style={{
              backgroundColor: 'rgba(236, 72, 153, 0.9)', // semi-transparent pink
              padding: 16,
              borderRadius: 12,
              width: width * 0.9,
              alignSelf: 'center',
              marginTop: 'auto',
              marginBottom:25
            }}
          >
            <Text style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'semi-bold',
            }}>
              Instacart
            </Text>
    </TouchableOpacity>
    </View>
    
  </SafeAreaView>
  )
}

export default shoppinglist