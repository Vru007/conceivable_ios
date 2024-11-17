// context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { login, signup, logout as logoutFn } from '../services/auth'; // Import your API methods
import { login,signup,logout,getUser as fetchUser,connectRing, verifyOTP } from '../api/auth';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentuser, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ring,setRing]=useState(false);

  //if ring and not subscribed: only temperature from direct ring, redirect to web
  //if not ring subscribed: manually input temp ka
  //if not ring and not subscribed: redirect to subsricption web link
  //image macros 
  //subscribed : 
  const loadUserFromStorage = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Here you would typically validate the token with your backend
        // and fetch the user data if the token is valid
        // For now, we'll just set a dummy user object
        console.log("token: ",token);
        await getUser();
        // setUser({ id: 'dummyId', username: 'dummyUser' });
      }
    } catch (error) {
      console.error("Error loading user from storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);


  const handleLogin = async (credentials) => {
    // console.log("inside auth: ",credentials);
    try {
      setLoading(true);
      const data = await login(credentials);
      // console.log("data after api part: ",data);
      // console.log("data.user: ",data.user);
      if (data.user && data.authToken) {
        // console.log("i am inside the if condition");
        setUser(data.user);
        await AsyncStorage.setItem('authToken', data.authToken);
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Re-throw the error so it can be handled in the UI
    } finally {
      setLoading(false);
    }
  };

   const cring=async()=>{
    try{
        const data=await connectRing();
        setRing(data);
    }
    catch(err){
    console.log("err: ",err);
    }
   }
   
  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('No token found');
        return;
      }

      
      const response = await fetchUser(token); 
      // console.log("data after fetch: ",response);

      if (!response) {
        await AsyncStorage.removeItem('authToken'); 
        // console.log('Error fetching user, logging out...');
        setUser(null);
      } else {
        
        setUser(response); // Set user data in state
      }
    } catch (error) {
      console.error('Error fetching user', error);
    }
  };

  const handleOtp=async(userData)=>{
     console.log("otp entered: ",userData);

     const response=await verifyOTP(userData)

  }
  const handleSignup = async (userData) => {
    console.log("userData: ",userData);
    try {
      setLoading(true);
      const response = await signup(userData);
      console.log("data inside context: ",response);
      if(response.status==200){
        return response;
      }
    } catch (error) {
      console.error("Signup failed", error);
      throw error; // Re-throw the error so it can be handled in the UI
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };
 
  // console.log("user: ",user);
 
  return (
    <AuthContext.Provider value={{ ring,currentuser,handleOtp, handleLogin, handleSignup, handleLogout,getUser, loading,isAuthenticated: !!currentuser,connectRing }}>
      {children}
    </AuthContext.Provider>
  );
};
