import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RoomCard = ({ room, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.roomName}>{room.name}</Text>
        <View style={styles.participantsInfo}>
          <Text style={styles.participantCount}>
            {room.participants.length} participants
          </Text>
        </View>
        <Text style={styles.hostInfo}>
          Hosted by {room.hostId.name}
        </Text>
        <View style={styles.participantsList}>
          {room.participants.slice(0, 3).map((participant, index) => (
            <View 
              key={participant._id} 
              style={[
                styles.participantIcon,
                index > 0 && styles.overlappingIcon
              ]}
            >
              {/* Add participant avatar or icon here */}
            </View>
          ))}
          {room.participants.length > 3 && (
            <Text style={styles.additionalParticipants}>
              +{room.participants.length - 3}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  content: {
    gap: 8,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantCount: {
    color: '#ffffff',
    opacity: 0.8,
  },
  hostInfo: {
    color: '#ffffff',
    opacity: 0.8,
  },
  participantsList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  participantIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#404040',
  },
  overlappingIcon: {
    marginLeft: -16,
  },
  additionalParticipants: {
    marginLeft: 8,
    color: '#ffffff',
    opacity: 0.8,
  },
});

export default RoomCard;