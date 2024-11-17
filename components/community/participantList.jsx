import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ParticipantList = ({ participants, hostId }) => {
  const renderParticipant = ({ item }) => {
    const isHost = item.userId === hostId;
    
    return (
      <View style={styles.participantItem}>
        <View style={styles.avatarContainer}>
          {/* You can replace this with an actual avatar component */}
          <View style={styles.avatar} />
          {isHost && (
            <MaterialIcons
              name="star"
              size={16}
              color="#FFD700"
              style={styles.hostBadge}
            />
          )}
        </View>
        <Text style={styles.participantName}>{item.userId.name}</Text>
        <MaterialIcons
          name={item.isMuted ? 'mic-off' : 'mic'}
          size={24}
          color={item.isMuted ? '#f44336' : '#4CAF50'}
        />
        {item.isSpeaking && (
          <MaterialIcons
            name="volume-up"
            size={24}
            color="#2196F3"
          />
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={participants}
      keyExtractor={item => item.userId._id}
      renderItem={renderParticipant}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666666',
  },
  hostBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 2,
  },
  participantName: {
    flex: 1,
    fontSize: 16

  }});

  export default ParticipantList;