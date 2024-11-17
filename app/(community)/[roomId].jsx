

// app/(community)/[id].jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { generateId } from '../../utils/generateId';

const socket = io('https://35r51lmr-3000.inc1.devtunnels.ms');

export default function RoomScreen() {
  const { id: roomId } = useLocalSearchParams();
  const router = useRouter();
  const [isHost, setIsHost] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [allowAllToSpeak, setAllowAllToSpeak] = useState(false);
  const [participants, setParticipants] = useState([]);
  const userId = generateId(); // Generate a random ID for the user
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // Initialize PeerJS with config for React Native
    const newPeer = new Peer(userId, {
      host: 'https://35r51lmr-3001.inc1.devtunnels.ms',
      port: 80, // Make sure to run PeerJS server on a different port
      secure: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });
    setPeer(newPeer);

    // Join room
    socket.emit('join-room', { roomId, userId });

    socket.on('room-joined', ({ isHost: hostStatus, allowAllToSpeak: speakPermission }) => {
      setIsHost(hostStatus);
      setAllowAllToSpeak(speakPermission);
    });

    socket.on('participant-joined', ({ userId }) => {
      setParticipants(prev => [...prev, userId]);
    });

    socket.on('participant-left', ({ userId }) => {
      setParticipants(prev => prev.filter(id => id !== userId));
    });

    socket.on('room-ended', () => {
      alert('Room has ended');
      router.back();
    });

    socket.on('speaking-permission-changed', ({ allowAllToSpeak }) => {
      setAllowAllToSpeak(allowAllToSpeak);
    });

    return () => {
      socket.emit('leave-room', { roomId, userId });
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  const toggleMic = async () => {
    if (!allowAllToSpeak && !isHost) {
      alert('You do not have permission to speak');
      return;
    }

    try {
      if (!isMicOn) {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Microphone permission denied');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setStream(recording);
        
        // Connect to all participants
        participants.forEach(participantId => {
          if (peer) {
            const call = peer.call(participantId, recording._uri);
          }
        });
      } else {
        if (stream) {
          await stream.stopAndUnloadAsync();
          setStream(null);
        }
      }
      setIsMicOn(!isMicOn);
    } catch (error) {
      console.error('Error toggling mic:', error);
      alert('Error toggling microphone');
    }
  };

  const toggleAllowAll = () => {
    if (!isHost) return;
    socket.emit('toggle-allow-all', { roomId, hostId: userId });
  };

  const leaveRoom = () => {
    socket.emit('leave-room', { roomId, userId });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room {roomId}</Text>
      
      <View style={styles.participantsList}>
        <Text style={styles.subtitle}>Participants ({participants.length})</Text>
        {participants.map(participantId => (
          <Text key={participantId} style={styles.participantItem}>
            {participantId === userId ? 'You' : participantId}
          </Text>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, isMicOn && styles.activeButton]}
          onPress={toggleMic}
        >
          <Text style={styles.buttonText}>
            {isMicOn ? 'Mic On' : 'Mic Off'}
          </Text>
        </TouchableOpacity>

        {isHost && (
          <TouchableOpacity 
            style={[styles.button, allowAllToSpeak && styles.activeButton]}
            onPress={toggleAllowAll}
          >
            <Text style={styles.buttonText}>
              {allowAllToSpeak ? 'Disable All Mics' : 'Enable All Mics'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.leaveButton]}
          onPress={leaveRoom}
        >
          <Text style={styles.buttonText}>Leave Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  participantsList: {
    marginBottom: 20,
  },
  participantItem: {
    fontSize: 16,
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#34C759',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},
});
