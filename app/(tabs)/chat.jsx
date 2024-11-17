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
import { useNavigation,useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import GenericChatBot from '../../components/chatBots/GenericBot';
import { useContext} from "react";
import { AuthContext } from "../../context/authContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from "expo-av";
import {
  CreateProjectKeyResponse,
  LiveClient,
  LiveTranscriptionEvents,
  createClient,
} from "@deepgram/sdk";
import axios from 'axios';  



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

const ChatScreen = () => {
  // State for managing input and UI
  const { currentuser } = useContext(AuthContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  // State management
  const [input, setInput] = useState('');
  const [selectedChatbot, setSelectedChatbot] = useState('Kirsten AI');
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [prevChatbot, setPrevChatbot] = useState(null);
  const [isRecording, setisRecording]=useState(false);
  // Message states
  const [kristenMessages, setKristenMessages] = useState([]);
  const [chefMessages, setChefMessages] = useState([]);
  const [emotionalMessages, setEmotionalMessages] = useState([]);
  const [record, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);

  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const scrollViewRef = useRef();
  const slideAnim = useRef(new Animated.Value(-300)).current;
const MODEL_URL = 'https://conceivable-dashboard-flask-4xxgb.ondigitalocean.app'
const deepgram = createClient("2349d6026b7a71823fba4c082a3b10411d2be6d0");
  // Function to generate menu
  const generateMenu = async () => {
    try {
      // Implementation of menu generation
      const token = await AsyncStorage.getItem('authToken');
      console.log("Generating Menu");
      const response = await axios.post(`${MODEL_URL}/generate-menu`,{
        headers: {
          'Access-Control-Allow-Origin':'*',
          'auth-token': token
        },
        timeout: 1000*30
      });
      console.log("menue-generate-response: ",response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to generate menu',
        position: 'bottom'
      });
    }
  };

  // Function to update personal details
  const updatePersonalDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log("Adding Personal details");
        const response = await axios.post(`${MODEL_URL}/update-personal-details`,{
          headers: {
            'Access-Control-Allow-Origin':'*',
            'auth-token': token
          },
          timeout: 1000*30
        });
      
        console.log("personal-detail-response: ",response);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to generate menu',
          position: 'bottom'
        });
      }
  };

  // Handle chatbot switching and cleanup
 
  
  

  // Configure chatbots
  const chatbots = [
    {
      name: 'Kirsten AI',
      icon: require('../../assets/Ai.png'),
      label: 'Update Kirsten AI',
      endpoint: 'https://conceivable-dashboard-flask-4xxgb.ondigitalocean.app/main-chat-bot',
      welcomeMessage: `Hey ${currentuser?.name}, I'm Kirsten AI. How can I help you today?`,
      messages: kristenMessages,
      setMessages: setKristenMessages,
      onExit: updatePersonalDetails
    },
    {
      name: 'Chef',
      icon: require('../../assets/chef.png'),
      label: 'Speak to Chef',
      endpoint: 'https://conceivable-dashboard-flask-4xxgb.ondigitalocean.app/menu-chat-bot',
      welcomeMessage:`Hey ${currentuser?.name}, I'm excited to work on your menu's. Do you mind if I ask you some additional questions?`,
      messages: chefMessages,
      setMessages: setChefMessages,
      onExit: generateMenu
    },
    {
      name: 'Emotional Support',
      icon: require('../../assets/emotional.png'),
      label: 'Emotional support',
      endpoint: 'https://conceivable-dashboard-flask-4xxgb.ondigitalocean.app/stress-chat-bot',
      welcomeMessage: `Hi ${currentuser?.name}, I'm here to support you. Would you like to talk about how you're feeling?`,
      messages: emotionalMessages,
      setMessages: setEmotionalMessages,
      onExit:null
    }
  ];

  
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
    onExit:currentBot.onExit
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


  const startRecording=async() =>{
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  const stopRecording=async()=>{
    setRecording(null);

    await record?.stopAndUnloadAsync();
    let allRecordings = [...recordings];
    const { sound, status } = await recording?.createNewLoadedSoundAsync();
    allRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: record.getURI(),
    });
    setConnection(deepgram.listen.live({ model, smart_format }));
    connection?.on(LiveTranscriptionEvents.Open, () => {
        connection.on(LiveTranscriptionEvents.Close, () => {
          console.log("Connection closed.");
        });
    
        connection.on(LiveTranscriptionEvents.Metadata, (data) => {
          console.log(data);
        });
    
        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
          console.log(data);
        });
      });
    setRecordings(allRecordings);

    getRecordingLines;
  }

  const getRecordingLines=()=> {

    console.log("recordings: ",recordings );

}

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
             <TouchableOpacity
          className={`absolute right-20 top-0.5 p-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-[#00A86B]'}`}
          onPress={isRecording ?  stopRecording : startRecording}
        >
          <MaterialCommunityIcons
            name={isRecording ? "microphone-off" : "microphone"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export default ChatScreen;