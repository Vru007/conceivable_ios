import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Header from '../../components/header'
const diffLayout = () => {
  return (
    <>
    <StatusBar style="light"/>
    <Stack>
    
    <Stack.Screen name="nosub"
     options={{
        headerShown:false
     }}
    />
    <Stack.Screen name="temptrack"
     options={{
      header: () => <Header />,
      headerShown: true,
     }}
    />
    <Stack.Screen name="toungeAnalysis"
     options={{
      header: () => <Header />,
      headerShown: true,
     }}
    />
    <Stack.Screen name="pastMacros"
     options={{
      header: () => <Header />,
      headerShown: true,
     }}
    />
  
    </Stack>
    
    </>
  )
}

export default diffLayout