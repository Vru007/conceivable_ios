import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import io from 'socket.io-client';
import { Asset } from 'expo-asset';
import { generateId } from '../../utils/generateId';

const socket = io('https://35r51lmr-3000.inc1.devtunnels.ms');

export default function CommunityScreen() {
  const [activeRooms, setActiveRooms] = useState([]);
  const router = useRouter();
  const userId = generateId();

  useEffect(() => {
    // Fetch active rooms from server
    fetch('https://35r51lmr-5000.inc1.devtunnels.ms/api/room/active')
      .then(res => res.json())
      .then(rooms => setActiveRooms(rooms));

    // Preload assets
    const preloadAssets = async () => {
      await Asset.loadAsync([
        require('../../assets/speaki.png'),
        require('../../assets/p1.png'),
        require('../../assets/p2.png'),
      ]);
    };
    
    preloadAssets();
  }, []);

  const createRoom = () => {
    const roomId = generateId();
    socket.emit('create-room', { roomId, hostId: userId });
    socket.once('room-created', () => {
      router.push(`/(community)/${roomId}`);
    });
  };

  const joinRoom = (roomId) => {
    router.push(`/(community)/${roomId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#011F25]">
      <ScrollView className="mt-10 px-4">
        <Text className="text-white text-2xl font-bold mb-4">Voice Rooms</Text>
        
        <TouchableOpacity 
          onPress={createRoom}
          className="bg-[#0097A0] p-4 rounded-lg mb-6"
        >
          <Text className="text-white text-center text-lg font-bold">Create New Room</Text>
        </TouchableOpacity>

        {activeRooms.map((room, index) => (
          <TouchableOpacity
            key={room.roomId}
            onPress={() => joinRoom(room.roomId)}
          >
            <View
              style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }}
              className="flex-row rounded-lg mb-3 overflow-hidden items-center justify-between"
            >
              {/* Left View for Title and Speaking Now */}
              <View className="flex-1 p-3">
                <Text className="text-white text-xl font-semibold mb-1">
                  Room {room.roomId}
                </Text>
                <View className="flex-row items-center">
                  <Image
                    source={require('../../assets/speaki.png')}
                    style={{ width: 20, height: 20, marginRight: 5 }}
                  />
                  <Text className="text-[#0097A0]">
                    {room.participants.length} participants
                  </Text>
                </View>
              </View>
              
              {/* Right View for Participant Circles */}
              <View className="flex-row items-center m-4">
                <View className="flex flex-col items-center">
                  {room.participants.slice(0, 2).map((participant, idx) => (
                    <View key={idx} className="bg-[#011F25] rounded-full w-14 h-14 justify-center items-center mb-2">
                      <Image 
                        source={require('../../assets/p1.png')}
                        style={{ width: 30, height: 30, borderRadius: 50 }}
                      />
                    </View>
                  ))}
                </View>
                {room.participants.length > 2 && (
                  <View className="flex flex-col items-center">
                    <View className="bg-[#011F25] rounded-full w-14 h-14 justify-center items-center mb-2">
                      <Image
                        source={require('../../assets/p2.png')}
                        style={{ width: 30, height: 30, borderRadius: 50 }}
                      />
                    </View>
                    {room.participants.length > 3 && (
                      <View className="bg-[#0097A0] rounded-full w-12 h-12 justify-center items-center">
                        <Text className="text-white text-lg">
                          +{room.participants.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}