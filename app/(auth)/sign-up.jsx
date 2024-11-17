import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Link } from 'expo-router';
import FormField from '../../components/auth/FormField';
import { AuthContext } from '../../context/authContext';
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
 const [name,setName]=useState('');
 const [phoneNumber, setphoneNumber]=useState('');
 const {handleSignup}=useContext(AuthContext);
 const [form,setForm]=useState({
  email:'',
  password:'',
  phoneNumber:'',
  name:''
})

 const pressSignup = async () => {
  setEmail(form.email);
  try {
    const response = await handleSignup({
      name: form.name,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber
    });
    
    console.log("sign-up response: ", response);
  
    if (response.status >= 200 && response.status < 300) {
      router.push({
        pathname: "/(auth)/otp",
        params: { email: email }
      });
      // router.push("/otp");
    } else {
      throw new Error(`Signup failed with status: ${response.status}`);
    }

  } catch (error) {
    console.error("Signup error:", error);
     throw new Error('Signup failed ',error); 
  }
};
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev); 
  };
  return (
    <SafeAreaView className="flex-1 bg-[#011F25]">
    <ScrollView>
    <View className="my-6 flex-1 bg-[#011F25] mb-5 px-8 justify-center items-center">
    
      {/* Logo and Tagline */}
      <View className="bg-white rounded-2xl p-5 shadow-lg mb-9">
        <Image
          source={require('../../assets/header.png')} 
          className="mx-auto"
          resizeMode="contain"
        />
      </View>
      <Text className="text-center text-lg text-white font-semibold ">
          The most personalized fertility program on the planet
        </Text>

        {/*Full Name */}
        <View className="mt-10 w-full">
     
      {/* Email Input */}
      {/*<Text className="text-white text-sm mb-1 flex self-start font-semibold">Email Address</Text>
      <TextInput
      style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
        className=" h-12 rounded-lg px-3 text-white"
        placeholder="example@gmail.com"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={setEmail}
      />*/}
       <FormField 
       title="Name"
        placeholder="user name"
       value={form.name}
       handleChangeText={(e)=>setForm({...form,
        name:e
       })}
       />

       <FormField 
       title="Email"
       value={form.email}
       placeholder="example@gmail.com"
       handleChangeText={(e)=>setForm({...form,
        email:e
       })}
       keyboardType="email-address"
      />
      

      
      {/* <View className="mb-2">
        <Text className="text-white mt-2 mb-1 font-semibold">Password</Text>
        <View className="flex-row items-center">
          <TextInput
          style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry={!showPassword}
            className=" w-full h-12 rounded-lg px-3 text-white"
            placeholderTextColor="#a9a9a9"
            
          />
          
        </View>
      </View>
      */}
      {/* Password Form */}
      <FormField 
       title="Password"
        placeholder="********"
       value={form.password}
       handleChangeText={(e)=>setForm({...form,
        password:e
       })}
      />


      <FormField 
       title="phoneNumber"
        placeholder=""
       value={form.phoneNumber}
       handleChangeText={(e)=>setForm({...form,
        phoneNumber:e
       })}
      />

      {/*<View className="mb-6">
        <Text className="text-white mb-1 font-semibold">Confirm Password</Text>
        <View className="flex-row items-center">
          <TextInput
          style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
            value={confirmpassword}
            onChangeText={setConfirmPassword}
            placeholder="********"
            secureTextEntry={!showPassword}
            className=" w-full h-12 rounded-lg px-3 text-white"
            placeholderTextColor="#a9a9a9"
            
          />
          
        </View>
      </View>*/}

      
      </View>
      {/* Sign In Button */}
      <TouchableOpacity onPress={pressSignup} className="bg-pink-400 w-full h-12 rounded-lg justify-center items-center mt-6">
        <Text className="text-lg text-white font-semibold">Sign Up</Text>
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
        Already have an account?{' '}
        <Link href="/sign-in" className="text-pink-400 font-semibold">Login In</Link>
      </Text>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}

export default SignUp