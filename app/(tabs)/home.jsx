import {View,Text,TouchableOpacity,Image,ScrollView,FlatList,Alert, Linking} from "react-native";
import React, { useContext,useState,useEffect } from "react";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons'; // For camera icon
// For thermometer and utensils icons
import { AntDesign } from '@expo/vector-icons'
import { Poppins_300Light, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext, AuthProvider } from '../../context/authContext';
// import NoSub from "../../components/NoSub";
import { TrackingCard, TrackingCards } from "../../components/cameraCard/FoodUploadComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePage = () => {
  const { isAuthenticated, loading, ring, currentuser } = useContext(AuthContext);
  const router=useRouter();
  // console.log("user in homepage: ",user);
  // console.log("dailytasks: ",user.dailyTasks);
  
  const [activeTab, setActiveTab] = useState("Quick");
  const [energyState, setEnergyState] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [vegetableLevel, setVegetableLevel] = useState(null);
  const [todos, setTodos] = useState([]);
 const [supplements,setSupplements]=useState([]);
 const host='https://conceivable-dashboard-node-goz8l.ondigitalocean.app';
   
    const [capturedImages, setCapturedImages] = useState({
      temperature: null,
      food: null
    });
  
    const handleImageCaptured = async (imageUri, type) => {
      setCapturedImages(prev => ({
        ...prev,
        [type]: imageUri
      }));
    }
      
     //{this function is to transform the object type to array type of the dailyTasks we are getting}
    const transformDailyTasks = (dailyTasks) => {

      if (!dailyTasks || !dailyTasks.tasks) {
        console.error('Invalid dailyTasks structure');
        return [];
      }
    
      return Object.values(dailyTasks.tasks).map(task => ({
        id: task.id.toString(),
        title: task.name,
        completed: task.isDone
      }));
    };
    const transformSupplements = (dailyTasks) => {
      
      console.log("supplements: ",dailyTasks);
      if (!dailyTasks) {
        console.error('Invalid dailyTasks structure');
        return [];
      }
    
      return Object.values(dailyTasks).map(task => ({
        id: task.id,
        name: task.name,
        link: task.link
      }));
    };
    
    const toggleTodo = async (id) => {
      console.log("id of tasks: ",id);
      const token = await AsyncStorage.getItem('authToken');
      try {
        
        const todoToUpdate = todos.find(todo => todo.id === id.toString());
        if (!todoToUpdate) return;
    
        
        const updatedTodos = todos.map(todo =>
          todo.id === id.toString() ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
    
        
        const response = await fetch(`${host}/api/auth/updateTasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'auth-token': token
          },
          body: JSON.stringify({
            taskId: id,
          })
        })
  
        // console.log("response: ",response.data);
        if (id == 5) {
          console.log("request of id 5 received: ");
          router.push('/(tabs)/chat')
        }

        if (!response.ok) {
          // If the server request fails, revert the optimistic update
          setTodos(todos);
          throw new Error('Failed to update task');
        }
       
        
        
        // Optional: Update with the server response if needed
        // const serverUpdatedTodos = todos.map(todo =>
        //   todo.id === id.toString() ? { ...todo, completed: data.isDone } : todo
        // );
        // setTodos(serverUpdatedTodos);
    
      } catch (error) {
        console.error('Error updating todo:', error);
        Alert.alert(
          'Error',
          'Failed to update the task. Please try again.',
          [{ text: 'OK' }]
        );
        // Revert the optimistic update
        setTodos(todos);
      }
    };
  
    const handlePurchase=async(link)=>{
      
      console.log("link: ",link);
      const url=link;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        try {
          await Linking.openURL(url);
        } catch (error) {
          Alert.alert(
            'Error',
            'Could not open the link. Please try again later.',
            [{ text: 'OK' }]
          );
          console.error('Error opening URL:', error);
        }
      } else {
        console.log("err: ");
        Alert.alert(
          'Error',
          'Unable to open the browser. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    }
 const handleSubscription=async()=>{
  const url="https://ai.conceivable.com/dashboard/payment-plans/"
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not open the link. Please try again later.',
        [{ text: 'OK' }]
      );
      console.error('Error opening URL:', error);
    }
  } else {
    console.log("err: ");
    Alert.alert(
      'Error',
      'Unable to open the browser. Please try again later.',
      [{ text: 'OK' }]
    );
  }
 }
    
  useEffect(() => {
    if (currentuser && currentuser.dailyTasks) {
      
      const transformedTodos = transformDailyTasks(currentuser.dailyTasks);
      const transformedSupplements=transformSupplements(currentuser.supplements);
      setTodos(transformedTodos);
      setSupplements(transformedSupplements);
      
    }
  }, [currentuser]);
  //add the dailyTasks as it is not to transform it into any state
  console.log("ring: ",ring);
  
  return (
    <SafeAreaView className="bg-[#011F25] flex-1 px-1">
    {currentuser && currentuser.subscription.current_period_end>0 &&(
    <View className=" flex-1 ">
      {/* Tab Selection */}
      <View style={{ backgroundColor:'rgba(237, 92, 171, 0.1)' }} className="flex-row bg-[rgba(237,92,171, 0.1)] rounded-full justify-between mb-5 py-2 mx-3 ">
        <TouchableOpacity onPress={() => setActiveTab("Quick")}>
          <Text
            className={`text-lg px-4 py-2 rounded-full ${
              activeTab === "Quick"
                ? "bg-[#ED5CAA] text-white"
                : "text-pink-500"
            }`}
          >
            Quick
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("Todos")}>
          <Text
            className={`text-lg px-4 py-2 rounded-full ${
              activeTab === "Todos"
                ? "bg-[#ED5CAA] text-white"
                : "text-pink-500"
            }`}
          >
            Todo's
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("Supplements")}>
          <Text
            className={`text-lg px-4 py-2 rounded-full ${
              activeTab === "Supplements"
                ? "bg-[#ED5CAA] text-white"
                : "text-pink-500"
            }`}
          >
            Supplements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Display */}
      <View className="flex-1 items-center justify-center">
        {activeTab === "Quick" && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1 px-2 w-11/12">
            <TrackingCards onImageCaptured={handleImageCaptured} />

            {/* Today's Energy Section */}
            <View className="mb-3">
              <Text className=" text-white text-lg font-semibold mb-2">
                Today's Energy
              </Text>
              <View className="flex-row justify-between mt-2">
                {["01", "02", "03", "04", "05"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setEnergyState(item)}
                    style={[
                      { backgroundColor: 'rgba(0, 151, 160, 0.1)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
                      energyState === item ? { backgroundColor: '#0097A0' } : { borderWidth: 1, borderColor: '#0097A0' }
                    ]}
                  >
                    <Text className={`text-base text-[#0097A0] ${energyState === item ? "text-white" : ""}`}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stress Level Section */}
            <View className="mb-2">
              <Text className="text-white text-lg font-semibold mb-2">
                Stress Level
              </Text>
              <View style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} className="py-0.5 flex-row justify-around  rounded-lg h-[105px]">
                <View>  
              <TouchableOpacity
                  onPress={() => setStressLevel("Low")}
                  style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
                  className={`bg-[#0097A0] rounded-lg items-center my-2 py-2 h-[80.5px] w-[90px] flex-1 ${
                    stressLevel === "Low" ? "border border-[#0097A0]" : ""
                  }`}
                >
                <Image
                source={require('../../assets/low.png')}
                className="w-10 h-10 rounded-full mb-1"
              />
                  <Text className="text-white text-sm mt-1">Low</Text>
                </TouchableOpacity>
                </View>
                <View>
                <TouchableOpacity
                  onPress={() => setStressLevel("Medium")}
                  style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
                  className={`bg-[rgba(0, 151, 160, 0.1)] rounded-lg items-center my-2 py-2 h-[80.5px] w-[90px] flex-1 ${
                    stressLevel === "Medium" ? "border border-[#0097A0]" : ""
                  }`}
                >
                <Image
                source={require('../../assets/medium.png')}
                className="w-10 h-10 rounded-full mb-1"
              />
                  <Text className="text-white text-sm mt-1">Medium</Text>
                </TouchableOpacity>
                </View>
                <View>
                <TouchableOpacity
                  onPress={() => setStressLevel("High")}
                  style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
                  className={`bg-[rgba(0, 151, 160, 0.1)] rounded-lg items-center my-2 py-2 h-[80.5px] w-[90px] flex-1 ${
                    stressLevel === "High" ? "border border-[#0097A0]" : ""
                  }`}
                >
                <Image
                source={require('../../assets/high.png')}
                className="w-10 h-10 rounded-full mb-1"
              />
                  <Text className="text-white text-sm ">High</Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Number of Vegetables Section */}
            <View className="mb-5">
              <Text className="text-white text-lg font-semibold mb-4">
                Number of Vegetables
              </Text>
              <View  style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} className="py-0.5 flex-row justify-around bg-[rgba(0, 151, 160, 0.1)] rounded-lg h-[105px]">
              <View>  
            <TouchableOpacity
                onPress={() => setVegetableLevel("Low")}
                style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
                className={`bg-[rgba(0, 151, 160, 0.1)] rounded-lg items-center my-2 py-2 h-[80.5px] w-[90px] flex-1 ${
                  vegetableLevel === "Low" ? "border border-[#0097A0]" : ""
                }`}
              >
              <Image
              source={require('../../assets/veg3.jpg')}
              className="w-10 h-10 rounded-full mb-1"
            />
                <Text className="text-white text-sm mt-1">1 to 3</Text>
              </TouchableOpacity>
              </View>
              <View>
              <TouchableOpacity
                onPress={() => setVegetableLevel("Medium")}
                style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
                className={`bg-[rgba(0, 151, 160, 0.1)] rounded-lg items-center my-2 py-2 h-[80.5px] w-[90px] flex-1 ${
                  vegetableLevel === "Medium" ? "border border-[#0097A0]" : ""
                }`}
              >
              <Image
              source={require('../../assets/veg2.jpg')}
              className="w-10 h-10 rounded-full mb-1"
            />
                <Text className="text-white text-sm mt-1">4 to 6</Text>
              </TouchableOpacity>
              </View>
              <View>
              <TouchableOpacity
                onPress={() => setVegetableLevel("High")}
                style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
                className={`bg-[rgba(0, 151, 160, 0.1)] rounded-lg items-center my-2 py-2 h-[80.5px] w-[90px] flex-1 ${
                  vegetableLevel === "High" ? "border border-[#0097A0]" : ""
                }`}
              >
              <Image
              source={require('../../assets/veg1.jpg')}
              className="w-10 h-10 rounded-full mb-1"
            />
                <Text className="text-white text-sm ">7 to 10</Text>
              </TouchableOpacity>
              </View>
            </View>
            </View>
          </ScrollView>
        )}

        {/* Todos Tab without ScrollView */}
        {activeTab === "Todos" && (
            <View className="flex-1 px-4 py-4 w-full">
            <FlatList
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
                  className="flex-row justify-between  items-center py-4 px-4 my-2 rounded-lg "
                  onPress={() => toggleTodo(item.id)}
                >
                  <Text className=" text-white text-lg font-semibold">{item.title}</Text>

                  {/* Checkmark icon for completed todos */}
                  {item.completed ? (
                    <AntDesign
                      name="checkcircle"
                      size={24}
                      color="#0097A0"
                    />
                  ) : (
                    <View className="h-6 w-6 border border-white rounded-full" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}


        {/* Active Supplements Part */ }
        {activeTab === "Supplements" && (
          <View className="flex-1 bg-[#011F25] px-4 py-4 w-full">
            <FlatList
              data={supplements}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
                  className="flex-row justify-between items-center py-4 px-4 my-2 rounded-lg bg-[rgba(0, 151, 160, 0.1)]"
                  
                >
                  <Text className="text-white text-lg font-semibold">{item.name}</Text>
                  <TouchableOpacity onPress={()=>handlePurchase(item.link)} style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)'}} className="text-white border border-[#50535B] rounded-2xl p-2">
                  <Text className="text-white">Purchase</Text>
                  </TouchableOpacity> 
                  {/* Checkmark icon for completed todos */}
                  {item.completed ? (
                    <AntDesign
                      name="checkcircle"
                      size={24}
                      color="#0097A0"
                    />
                  ) : (
                    <View className="h-6 w-6 border border-white rounded-full" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        </View>
      </View>
      )}

      {currentuser && currentuser.subscription.current_period_end<=0 &&(
         <View className="flex-1 items-center px-5 mt-10">
             <Text className="text-white ">Purchase Your subscription Now</Text>
             <TouchableOpacity
              onPress={handleSubscription}
              className="bg-pink-400 p-3 rounded-xl w-3/4"
            >
              <Text className="text-lg font-bold text-white">Subscribe Now</Text>
            </TouchableOpacity>
         </View>
      )}
    </SafeAreaView>
  );
};

export default HomePage;
