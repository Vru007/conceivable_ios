import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Animated, 
  SafeAreaView, 
  Keyboard, 
  TouchableWithoutFeedback, 
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import GenericChatBot from './GenericBot';
import { useContext} from "react";
import { AuthContext } from "../../context/authContext";




const MessageBubble = ({ message }) => {
  const isUser = message.type === 'user';
  return (
    <View 
      className={`flex flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <View 
        className={`rounded-lg p-3 max-w-[80%] ${
          isUser ? 'bg-[#00A86B]' : 'bg-[#032D38]'
        }`}
      >
        <Text className="text-white text-base">
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const QuestionBot = () => {
  // State for managing input and UI
  const { currentuser } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [selectedChatbot, setSelectedChatbot] = useState('Question Bot');
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // State for managing messages for each chatbot
  const [questionMessages, setQuestionMessages] = useState([]);

  const scrollViewRef = useRef();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  // Configure chatbots
  const chatbots = [
    {
      name: 'Question Bot',
      icon: require('../../assets/question.png'),
      label: 'Ask a question',
      endpoint: 'https://conceivable-dashboard-flask-4xxgb.ondigitalocean.app/question-chat-bot',
      welcomeMessage: `Hello ${currentuser?.name}, Just type Hi to start the conversation`,
      messages: questionMessages,
      setMessages: setQuestionMessages
    },

  ];

  const handleIndex8=()=>{
    
      console.log("index 8: hitted: ");
  }
  
  // Get current chatbot configuration
  const getCurrentChatbot = () => {
    return chatbots.find(bot => bot.name === selectedChatbot);
  };

  // Initialize GenericChatBot instances
  const currentBot = getCurrentChatbot();

  const { sendMessage, isGenerating, MessageBubble } = GenericChatBot({
  apiEndpoint: currentBot.endpoint,
  welcomeMessage: currentBot.welcomeMessage,
  botName: currentBot.name,
  isActive: true,
  onMessageReceived: (message) => {
    currentBot.setMessages(prev => [...prev, message]);
  },
  onIndex8Reached: handleIndex8, // Only provided in QuestionBot
  isQuestionBot: true, // Only set to true in QuestionBot
  
});

  // UI handlers
  const handleSend = () => {
    if (input.trim() === '') return;
    sendMessage(input);
    setInput('');
    setIsTyping(false);
  };

  const toggleChatbotSection = () => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    } else {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleInputChange = (text) => {
    setInput(text);
    setIsTyping(text.length > 0);
  };

  const handleScreenTap = () => {
    Keyboard.dismiss();
    setIsTyping(false);
  };
 const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [currentBot.messages]);
  // Auto-scroll to bottom when new messages arrive
  {/*useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [currentBot.messages]);*/}

 return (
    <SafeAreaView className="flex-1 bg-[#031E26]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="flex-1">
          {/* AI Disclaimer */}
          <View className="w-full pt-2 pb-4 px-4">
            <Text className="text-xs text-gray-200">
              AI can make mistakes.
              {"\n"}Always coordinate with your doctor.
            </Text>
          </View>

          {/* Chatbot Selection */}
          {isVisible && (
            <Animated.View
              style={{
                transform: [{ translateX: slideAnim }],
                position: 'absolute',
                top: 60,
                right: 0,
                zIndex: 1,
                width: '100%',
                padding: 4,
                backgroundColor: 'rgba(0, 151, 160, 0.1)',
              }}
            >
              <View className="flex-row flex-wrap justify-between bg-[#283C4B] gap-1">
                {chatbots.map((bot) => (
                  <TouchableOpacity
                    key={bot.name}
                    className={`w-[48%] p-3 mb-3 rounded-lg flex-row items-center justify-center ${
                      selectedChatbot === bot.name
                        ? 'bg-[#283C4B] border border-[#0097A0]'
                        : 'bg-[#283C4B]'
                    }`}
                    onPress={() => setSelectedChatbot(bot.name)}
                  >
                    <Image style={{width:20, height:20}} className="m-2" source={bot.icon} />
                    <Text className="text-white text-center">{bot.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Chat Area */}
          <View className="flex-1">
            <ScrollView
              ref={scrollViewRef}
              className="flex-1 px-4"
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 20,
              }}
              showsVerticalScrollIndicator={true}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {currentBot.messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {isGenerating && (
                <View className="p-3">
                  <Text className="text-gray-400">AI is typing...</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Input Section */}
          <View className="pb-6 px-4 bg-[#031E26]">
            <View className="relative w-full">
              {!isTyping && (
                <TouchableOpacity 
                  onPress={toggleChatbotSection}
                  className="absolute left-2 top-2 z-10"
                >
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="#00A86B" />
                </TouchableOpacity>
              )}
              <TextInput
                className={`w-full p-3 ${!isTyping ? 'pl-12' : 'pl-4'} pr-14 rounded-full bg-white bg-opacity-60 text-black placeholder-gray-400 text-sm`}
                placeholder="Type your message..."
                value={input}
                onChangeText={handleInputChange}
                multiline
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity 
                className="absolute right-0.5 top-0.5 bg-[#00A86B] p-3 rounded-full"
                onPress={handleSend}
                disabled={isGenerating || !input.trim()}
              >
                <MaterialCommunityIcons name="arrow-up" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export default QuestionBot;