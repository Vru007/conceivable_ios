import React, { useState, useContext,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import FormField from '../../components/auth/FormField';
import { AuthContext } from '../../context/authContext';
const Otp = () => {
    const { email } = useLocalSearchParams();
    
  const { isAuthenticated, loading, ring, currentuser, handleOtp} = useContext(AuthContext);
 
  useEffect(() => {
    if (!loading) {
      // Redirect to appropriate screen based on auth state
      if (isAuthenticated && ring) {
        router.replace('/home');
      }
      else if(isAuthenticated && !ring){
        router.replace('/ring');
      }
    }
  }, [currentuser,isAuthenticated, loading]);

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const {handleLogin}=useContext(AuthContext);
  const [form,setForm]=useState({
    otp:''
  });
  
 const pressConfirm=async()=>{
    console.log("otp: ",form.otp);
    console.log("email: ,",email);
    const response=await handleOtp({otp:form.otp,email:email});
//   if (!loading) {
//     // Redirect to appropriate screen based on auth state
//     if (currentuser) {
//       router.replace('/home');
//     }
//     else if(isAuthenticated && !ring){
//       router.replace('/ring');
//     }
//   }
 }
  return (
    <SafeAreaView className="flex-1 bg-[#011F25]">
    <ScrollView>
    <View className="my-6 flex-1 bg-[#011F25] px-8 justify-center items-center">
      
      {/* Logo and Tagline */}
      <View className="bg-white rounded-2xl p-5 shadow-lg mb-9">
        <Image
          source={require('../../assets/header.png')} 
          className="mx-auto"
          resizeMode="contain"
        />
      </View>
      <Text className="text-center text-lg text-white font-semibold mb-20">
          The most personalized fertility program on the planet
        </Text>

      {/* Email Input */}
      {/*<Text className="text-white text-sm mb-1 flex self-start font-semibold">Email Address</Text>
      <TextInput
      style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
        className=" w-full h-12 rounded-lg px-3 text-white"
        placeholder="example@gmail.com"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={setEmail}
      />*/}

      {/* Email Form */}
      <FormField 
       title="Otp"
       value={form.otp}
       placeholder="check your email for otp"
       handleChangeText={(e)=>setForm({...form,
        otp:e
       })}
       keyboardType="email-address"
      />

      {/* Sign In Button */}
      <TouchableOpacity className="bg-pink-400 w-full h-12 rounded-lg justify-center items-center mt-6"
        onPress={()=>pressConfirm()}
      >
        <Text className="text-lg text-white font-semibold">Confirm</Text>
      </TouchableOpacity>

      {/* Social Sign-In Options */}
      {/* Sign Up Text */}
      <Text className="text-white text-center mt-6">
        Want to Sign-up again ?{' '}
        <Link href="/sign-up" className="text-pink-400 font-semibold">Sign Up</Link>
      </Text>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}

export default Otp