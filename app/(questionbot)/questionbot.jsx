import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import QuestionBot from '../../components/chatBots/askQuestionChat'
import { AuthContext } from '../../context/authContext'
import { useRouter } from 'expo-router'

const QuestionBotPage = () => {
  const { currentuser } = useContext(AuthContext)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication immediately
    if (!currentuser) {
      router.replace('/login') // Redirect to login if no user
      return
    }

    // Check user index
    if (currentuser.index == 8) {
      router.push('/home')
      return
    }

    // If we pass both checks, stop loading
    setIsLoading(false)
  }, [currentuser])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <View className="bg-[#031E26] flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">Loading...</Text>
      </View>
    )
  }

  // If index is 8, don't render anything while redirecting
  if (currentuser?.index == 8) {
    router.replace('/home');
  }

  // Only render the actual content if we pass all checks
  return (
    <View className="flex-1">
      <QuestionBot />
    </View>
  )
}

export default QuestionBotPage