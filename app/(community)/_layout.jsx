import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const CommunityLayout = () => {
   
     return (
       <Stack
         screenOptions={{
           headerStyle: {
             backgroundColor: '#1a1a1a',
           },
           headerTintColor: '#ffffff',
           headerTitleStyle: {
             fontWeight: 'bold',
           },
         }}
       >
         <Stack.Screen
           name="community"
           options={{ 
             headerShown: true,
           }}
         />
         <Stack.Screen
           name="[roomId]"
           options={{ 
             headerShown: false,
           }}
         />
       </Stack>
     );
   }


export default CommunityLayout;