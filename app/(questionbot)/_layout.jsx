import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const QuestionBot = () => {
  return (
    <>
    <StatusBar style="light"/>
    <Stack>
    
    <Stack.Screen name="questionbot"
     options={{
        headerShown:false,
     }}
    />
    </Stack>
    
    </>
  )
}

export default QuestionBot