import React,{useContext, useState}from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Linking, Alert  } from 'react-native';
import { AuthContext } from '../../context/authContext';
import { useRouter, useRootNavigationState } from 'expo-router';
const UserProfile = () => {

 const { handleLogout,currentuser } = useContext(AuthContext);
 console.log("currentuser inside profle: ",currentuser);
const [name,setName]=useState(null);
const [email,setEmail]=useState(null);
const [phoneNumber,setPhoneNumber]=useState(null);
 const router = useRouter();
 const handlePress=async()=>{
    try{
    await handleLogout();
    // console.log("user after logout: ",user);
     if(currentuser===null){
        router.push('/');
     }
    }
    catch(err){
        console.log("err: ",err);
    }
 }

 const handleChangePassword=async()=>{
    console.log("request to change password : ");
      const url = 'https://ai.conceivable.com/forgot';
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        try {
          await Linking.openURL(url);
        } catch (error) {
          Alert.alert(
            'Error',
            'Could not open the forgot password page. Please try again later.',
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
 
  return (
    
    <SafeAreaView className="flex-1 bg-[#011F25]">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Profile Card */}
        <View className="bg-[rgba(0,151,160,0.1)] rounded-lg p-4 flex-row items-center mb-6">
          <Image
            source={require('../../assets/profile.png')} // Replace with actual image path
            className="w-16 h-16 rounded-full mr-4"
          />
          <View>
            <Text className="text-[#ED5CAB] text-2xl font-bold">{currentuser.name}</Text>
            {/*<Text className="text-gray-400">CEO @VogueOfficial</Text>*/}
          </View>
        </View>

        {/* Contact Information */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-2">Email</Text>
          <Text className="text-gray-400 mb-4">{currentuser.email}</Text>

          <Text className="text-white text-xl font-bold mb-2">Phone Number</Text>
          <Text className="text-gray-400 mb-4">{currentuser.phoneNumber}</Text>

          <TouchableOpacity onPress={()=>handleChangePassword()} className="bg-[#ED5CAB] rounded-md py-3 px-5">
            <Text className="text-white text-center">Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* About Me Section */}
      {/*  <View className="bg-[rgba(0,151,160,0.1)] rounded-lg p-4 mb-6">
          <Text className="text-white text-xl font-bold mb-3">About Me</Text>
          <Text className="text-gray-400">
            Hi there! I'm Anaya, a passionate advocate for holistic health and wellness. My journey started a few years ago when I realized the importance of a balanced lifestyle in achieving overall well-being. I believe in mindful living, and the supportive strength of a community.
          </Text>
        </View>*/}

        {/* Logout Button */}
        <TouchableOpacity onPress={()=>handlePress()} className="bg-[#ED5CAB] rounded-xl py-3 px-5 mx-auto w-1/2 mt-5">
          <Text className="text-white text-center">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    
  )
};

export default UserProfile;
