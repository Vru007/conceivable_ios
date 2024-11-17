import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { AuthContext } from '../../context/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const PeriodTracker = () => {
  const { ring } = useContext(AuthContext);
  const [selectedDates, setSelectedDates] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentDay, setCurrentDay] = useState(0);
  
  useEffect(() => {
    const date = new Date();
    setCurrentMonth(date.toLocaleString('default', { month: 'long' }));
    setCurrentDay(date.getDate());
  }, []);

  // Get days in current month
  const getDaysInMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth() }, (_, i) => i + 1);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleDateSelect = (day) => {
    if (selectedDates.includes(day)) {
      setSelectedDates(selectedDates.filter(d => d !== day));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  const handleTemperatureSubmit = async () => {
    try {
      console.log('Temperature updated:', temperature);
    } catch (error) {
      console.error('Error updating temperature:', error);
    }
  };

  const getDayStyle = (day) => {
    const baseStyle = "items-center justify-center aspect-square w-[14.28%] rounded-full";
    if (day === currentDay) {
      return `${baseStyle} bg-purple-500`;
    }
    if (selectedDates.includes(day)) {
      return `${baseStyle} bg-teal-500`;
    }
    return baseStyle;
  };

  const getDayTextStyle = (day) => {
    const baseStyle = "text-white";
    if (day === currentDay) {
      return `${baseStyle} font-bold`;
    }
    if (selectedDates.includes(day)) {
      return `${baseStyle}`;
    }
    return baseStyle;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#011F25]">
    
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View className="p-4 rounded-lg">
      {/* Month Selector */}
      <View className="items-center mb-4">
        <Text className="text-white text-xl">
          {currentMonth} ▼
        </Text>
      </View>

      {/* Calendar */}
      <View className="mb-4">
        {/* Week days header */}
        <View className="flex-row mb-2">
          {weekDays.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-gray-400">{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View className="flex-row flex-wrap">
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => handleDateSelect(day)}
              className={getDayStyle(day)}
            >
              <Text className={getDayTextStyle(day)}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Temperature Input */}
      {!ring && (
        <View className="mb-4">
          <TextInput
            className="bg-gray-800 text-white p-2 rounded-md mb-2"
            placeholder="Enter temperature"
            placeholderTextColor="#9ca3af"
            value={temperature}
            onChangeText={setTemperature}
          />
          <TouchableOpacity
            onPress={handleTemperatureSubmit}
            className="bg-teal-500 p-2 rounded-md items-center"
          >
            <Text className="text-white text-base">
              Submit Temperature
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Analyze Button */}
      <TouchableOpacity className="bg-teal-500 p-3 rounded-md items-center">
        <Text className="text-white text-lg">
          Analyse
        </Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default PeriodTracker;