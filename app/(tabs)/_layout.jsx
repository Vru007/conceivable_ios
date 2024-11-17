import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Icons library
import { Tabs } from 'expo-router'; // For Tab navigation
import { StatusBar } from 'expo-status-bar';

const TabsLayout = () => {
  return (
    <>
    <Tabs
      screenOptions={{
        headerShown: false, // Hide header if not needed
        tabBarShowLabel: true, // Show labels as in the image
        tabBarStyle: {
          backgroundColor: '#1E2732', // Dark background color matching the footer
          borderTopWidth: 0, // Remove border if needed
          elevation: 0, // Remove shadow on Android
        },
        tabBarActiveTintColor: '#FF4081', // Active icon color
        tabBarInactiveTintColor: '#A0A0A0', // Inactive icon color
        keyboardHidesTabBar: true, // Ensure tab bar hides with keyboard
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* Food Tab */}
      <Tabs.Screen
        name="food"
        options={{
          tabBarLabel: 'Food',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="food" size={24} color={color} />
          ),
        }}
      />

      {/* Stress Tab */}
      <Tabs.Screen
        name="creator"
        options={{
          tabBarLabel: 'Creator Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Chat Tab */}
      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" size={24} color={color} />
          ),
        }}
      />

      {/* Progress Tab */}
      <Tabs.Screen
        name="progress"
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="progress-check" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
    <StatusBar style="light"/>
    </>
  );
};

export default TabsLayout;
