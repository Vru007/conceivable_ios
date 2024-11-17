import React, { useState, useContext,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import FormField from '../../components/auth/FormField';
import { AuthContext } from '../../context/authContext';
const SignIn = () => {
  const { isAuthenticated, loading, ring, currentuser} = useContext(AuthContext);
 
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
    email:'',
    password:''
  });
  
 const pressLogin=async()=>{
  await handleLogin({email:form.email, password:form.password});
  // console.log("inside press: ",isAuthenticated);
  // console.log("loading,: ",loading);
  // console.log("user after signin: ",user);
  if (!loading) {
    // Redirect to appropriate screen based on auth state
    if (currentuser) {
      router.replace('/home');
    }
    else if(isAuthenticated && !ring){
      router.replace('/ring');
    }
  }
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
       title="Email"
       value={form.email}
       placeholder="example@gmail.com"
       handleChangeText={(e)=>setForm({...form,
        email:e
       })}
       keyboardType="email-address"
      />

      {/* Password Form */}
      <FormField 
       title="Password"
        placeholder="********"
       value={form.password}
       handleChangeText={(e)=>setForm({...form,
        password:e
       })}
      />

      
      {/*<View className="mb-6">
        <Text className="text-white mt-2 mb-1 font-semibold">Password</Text>
        <View className="flex-row items-center">
          <TextInput
          style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
            value={password}
            onChangeText={setPassword}
           
            secureTextEntry={!showPassword}
            className=" w-full h-12 rounded-lg px-3 text-white"
            placeholderTextColor="#a9a9a9"
            
          />
          
        </View>
      </View>*/}

      {/* Sign In Button */}
      <TouchableOpacity className="bg-pink-400 w-full h-12 rounded-lg justify-center items-center mt-6"
        onPress={()=>pressLogin()}
      >
        <Text className="text-lg text-white font-semibold">Sign In</Text>
      </TouchableOpacity>

      {/* Social Sign-In Options */}
      <View className="flex-row justify-center items-center mt-4 w-full gap-2 mt-5">
      <TouchableOpacity className="border border-[#50535B] rounded-2xl p-2">
          <Image
            source={require('../../assets/apple.png')}
            className="w-10 h-10"
          />
        </TouchableOpacity>
        <TouchableOpacity className="border border-[#50535B] rounded-2xl p-2">
          <Image
            source={require('../../assets/google.png')}
            className="w-10 h-10"
          />
        </TouchableOpacity>
        <TouchableOpacity className="border border-[#50535B] rounded-2xl p-2">
          <Image
            source={require('../../assets/facebook.png')}
            className="w-10 h-10"
          />
        </TouchableOpacity>
      </View>

      {/* Sign Up Text */}
      <Text className="text-white text-center mt-6">
        Don't have an account?{' '}
        <Link href="/sign-up" className="text-pink-400 font-semibold">Sign Up</Link>
      </Text>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}

export default SignIn