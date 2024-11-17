import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const ProfileLayout = () => {
  return (
    <>
    <StatusBar style="light"/>
    <Stack>
    
    <Stack.Screen name="profile"
     options={{
        headerShown:false,
     }}
    />
    </Stack>
    
    </>
  )
}

export default ProfileLayout