import React, { useContext, useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import Toast from 'react-native-toast-message';
import { AuthContext } from "../../context/authContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const GenericChatBot = ({
  apiEndpoint,
  welcomeMessage,
  botName,
  isActive,
  onMessageReceived,
  onIndex8Reached,
  isQuestionBot = false,
  onExit // New prop for handling bot exit
}) => {
  const { currentuser } = useContext(AuthContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasDetails, setHasDetails] = useState(false);

  useEffect(() => {
    if (isActive) {
      const initialMessage = {
        type: 'assistant',
        content: welcomeMessage.replace('${currentuser?.name}', currentuser?.name || 'there')
      };
      onMessageReceived(initialMessage);
    }

    // Cleanup function to handle bot exit
    return () => {
      if (onExit && isActive) {
        onExit();
      }
    };
  }, [isActive, currentuser]);

  useEffect(() => {
    const details = currentuser.hasDetails;
    setHasDetails(details);
  }, [currentuser]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    try {
      setIsGenerating(true);
      const userMessage = { type: 'user', content: text };
      onMessageReceived(userMessage);

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(
        apiEndpoint,
        {
          data: { user: text }
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'auth-token': token,
          }
        }
      );
       console.log("response ques:",response.data);
      if (response.data.success) {
        const assistantMessage = { type: 'assistant', content: response.data.reply };
        onMessageReceived(assistantMessage);

        if (isQuestionBot && onIndex8Reached && response.data.index === 8 && hasDetails === false) {
          await onIndex8Reached();
          return;
        }
      } else {
        throw new Error(response.data.error || 'Failed to get response');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
        position: 'bottom'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';
    return (
      <View className={`flex flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <View className={`rounded-lg p-3 max-w-[80%] ${isUser ? 'bg-[#00A86B]' : 'bg-[#032D38]'}`}>
          <Text className="text-white text-base">{message.content}</Text>
        </View>
      </View>
    );
  };

  return {
    sendMessage,
    isGenerating,
    MessageBubble
  };
};

export default GenericChatBot;