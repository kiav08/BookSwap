import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { firestore } from '../FirebaseConfig';

const Chat = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('Users').onSnapshot((snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Chatmessages', { userId: item.id, userName: item.name })}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.avatar || 'default-avatar-url' }} style={styles.avatar} />
        <View style={styles.messageContainer}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={styles.list}
    />
  );
};

export default Chat;
