import React, { useState, useEffect, useContext } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import TodayMenu from '../../../components/todaysMenu';
import { Ionicons } from '@expo/vector-icons';
import { getMenu } from '../../../api/menu';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/authContext';
import { useFocusEffect } from '@react-navigation/native';

const FoodPage = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [daysToDisplay, setDaysToDisplay] = useState([]);
  const [showTomorrowMessage, setShowTomorrowMessage] = useState(false);
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Initialize with 1 instead of 0
  const [isMenuExpired, setIsMenuExpired] = useState(false);
  const [isGenerating, setisGenerating] = useState(false);
  const { currentuser } = useContext(AuthContext);

  const transformMenuData = (menuPlan, createdAt) => {
    if (!menuPlan) {
      console.error('Menu plan is undefined');
      return [];
    }

    const startDate = dayjs(createdAt);
    const today = dayjs();
    const daysSinceCreation = today.diff(startDate, 'day') + 1;
    
    if (daysSinceCreation >= 7) {
      setIsMenuExpired(true);
      return [];
    }

    // Create array with 1-based indexing
    const dailyMenus = Array.from({ length: 7 }, (_, index) => {
      const dayNum = index + 1; // dayNum is now directly usable for the backend fields
      const menuDate = startDate.add(index, 'day');
      
      return {
        date: menuDate,
        dayIndex: dayNum, // Store the 1-based index
        recipes: [
          {
            title: 'Breakfast',
            description: menuPlan[`breakfast_d${dayNum}`] || 'No menu available',
            duration: '08:00',
            imageUrl: require('../../../assets/breakfast.png'),
          },
          {
            title: 'Morning Snack',
            description: menuPlan[`am_snack_d${dayNum}`] || 'No menu available',
            duration: '10:30',
            imageUrl: require('../../../assets/snack.png'),
          },
          {
            title: 'Lunch',
            description: menuPlan[`lunch_d${dayNum}`] || 'No menu available',
            duration: '13:00',
            imageUrl: require('../../../assets/lunch.png'),
          },
          {
            title: 'Afternoon Snack',
            description: menuPlan[`afternoon_snack_d${dayNum}`] || 'No menu available',
            duration: '16:00',
            imageUrl: require('../../../assets/snack.png'),
          },
          {
            title: 'Dinner',
            description: menuPlan[`dinner_d${dayNum}`] || 'No menu available',
            duration: '19:00',
            imageUrl: require('../../../assets/dinner.png'),
          },
        ]
      };
    });

    return dailyMenus;
  };

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const generateStatus = await currentuser.isGeneratingMenu;
      setisGenerating(generateStatus);

      const response = await getMenu();
      if (response?.success && response?.menuPlan) {
        const startDate = dayjs(response.menuPlan.createdAt);
        const modifiedMenuPlan = {
          ...response.menuPlan,
        };

        const days = Array.from({ length: 7 }, (_, i) => 
          startDate.add(i, 'day')
        );
        setDaysToDisplay(days);

        const transformedData = transformMenuData(
          modifiedMenuPlan, 
          modifiedMenuPlan.createdAt
        );

        if (transformedData.length > 0) {
          setMenuData(transformedData);
          
          const today = dayjs();
          if (today.isBefore(startDate)) {
            setSelectedDate(startDate);
            setSelectedDayIndex(1); // First day is index 1
          } else if (today.isAfter(startDate.add(6, 'day'))) {
            setSelectedDate(startDate.add(6, 'day'));
            setSelectedDayIndex(7); // Last day is index 7
          } else {
            const dayIndex = today.diff(startDate, 'day') + 1; // Add 1 for 1-based indexing
            setSelectedDate(today);
            setSelectedDayIndex(dayIndex);
          }
        }
      } else {
        console.error('Invalid menu data received:', response);
        setIsMenuExpired(true);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const handleDayPress = (day) => {
    const selectedDay = dayjs(day);
    const today = dayjs();
    
    const isFutureDay = selectedDay.isAfter(today, 'day') && 
                       selectedDay.isBefore(daysToDisplay[6].add(1, 'day'));
    setShowTomorrowMessage(isFutureDay);
    
    // Calculate the new day index based on the selected date (1-based)
    const startDate = daysToDisplay[0];
    const newDayIndex = selectedDay.diff(startDate, 'day') + 1;
    setSelectedDayIndex(newDayIndex);
    setSelectedDate(selectedDay);
  };

  const getMenuTitle = () => {
    if (selectedDate.isSame(dayjs(), 'day')) {
      return "Today's Menu";
    } else {
      return `${selectedDate.format('dddd')}'s Menu`;
    }
  };

  const getCurrentDayMenu = () => {
    if (!menuData || menuData.length === 0) return [];
    const selectedDayData = menuData.find(menu => 
      menu.date.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
    );
    return selectedDayData?.recipes || [];
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMenuData();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#011F25] justify-center items-center">
        <ActivityIndicator size="large" color="#0097A0" />
      </SafeAreaView>
    );
  }

  if (isGenerating) {
    return (
      <SafeAreaView className="flex-1 bg-[#011F25] justify-center items-center p-4">
        <Text className="text-white text-xl text-center">
          Your menu is being generated by our chef. Please wait...
        </Text>
      </SafeAreaView>
    );
  }

  if (isMenuExpired) {
    return (
      <SafeAreaView className="flex-1 bg-[#011F25] justify-center items-center p-4">
        <Text className="text-white text-xl text-center mb-4">
          Your current menu has expired
        </Text>
        <Text className="text-white text-lg">Talk With our Ai chef to build a custom, personalised menu</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#011F25] px-1">
      <View className='py-5 px-2'>
        <Modal visible={isCalendarVisible} animationType="slide" transparent={true}>
          <View className="flex-1 bg-[#00000080] justify-center">
            <View className="bg-white rounded-lg p-5">
              <Calendar
                onDayPress={(day) => {
                  const selectedDay = dayjs(day.dateString);
                  const startDate = daysToDisplay[0];
                  const newDayIndex = selectedDay.diff(startDate, 'day') + 1; // Add 1 for 1-based indexing
                  setSelectedDayIndex(newDayIndex);
                  setSelectedDate(selectedDay);
                  setCalendarVisible(false);
                }}
                markedDates={{
                  [selectedDate.format('YYYY-MM-DD')]: { selected: true, selectedColor: '#00adf5' },
                }}
                minDate={daysToDisplay[0]?.format('YYYY-MM-DD')}
                maxDate={daysToDisplay[6]?.format('YYYY-MM-DD')}
              />
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Text className="text-blue-500 text-center mt-2">Close Calendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View className='flex-col items-center'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {daysToDisplay.map((day, index) => {
                const isToday = day.isSame(dayjs(), 'day');
                const isSelected = selectedDate.isSame(day, 'day');
                const backgroundColor = isToday ? '#0097A0' : (isSelected ? 'transparent' : 'rgba(0, 151, 160, 0.1)');
                const borderColor = isSelected ? '#0097A0' : 'transparent';
                const borderWidth = isSelected ? 2 : 0;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleDayPress(day)}
                    style={{
                      backgroundColor,
                      borderColor,
                      borderWidth,
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      marginHorizontal: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text className="text-white text-center">{day.format('ddd')}</Text>
                    <Text className="text-white text-center">{day.format('D')}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity onPress={toggleCalendar} className="flex-row items-center mt-2">
          <Ionicons name="calendar-outline" size={24} color="#00adf5" />
          <Text className="text-blue-500 ml-2">Calendar</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4">
        <View className='flex items-center'>
          <Text className="text-white text-xl font-bold mb-2">{getMenuTitle()}</Text>
        </View>
        <TodayMenu recipes={getCurrentDayMenu()} currentDay={selectedDayIndex} />
      </View>
    </SafeAreaView>
  );
};

export default FoodPage;