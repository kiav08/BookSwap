import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../FirebaseConfig";
import globalStyles from "../styles/globalStyles";

export default function Chat({ navigation }) {
  const [chats, setChats] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const db = getDatabase();

    // Fetch all chats
    const chatsRef = ref(db, "chats");
    const booksRef = ref(db, "books");

    const unsubscribeChats = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filteredChats = Object.entries(data)
          .filter(
            ([, chat]) =>
              chat.senderId === currentUser.uid || chat.receiverId === currentUser.uid
          )
          .map(([id, chat]) => ({ id, ...chat }));
        setChats(filteredChats);
      } else {
        setChats([]);
      }
    });

    // Fetch all book titles
    const unsubscribeBooks = onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map book IDs to titles
        const titlesMap = {};
        Object.entries(data).forEach(([key, book]) => {
          titlesMap[key] = book.title; // Use the database key as the ID
        });
        setBookTitles(titlesMap); // Store titles mapped to book IDs
      }
    });

    return () => {
      unsubscribeChats();
      unsubscribeBooks();
    };
  }, [currentUser]);

  const renderChat = ({ item }) => {
    const isSender = item.senderId === currentUser.uid;
    const messagePrefix = isSender ? "Mig:" : "Anmodning:";

    const otherUserId =
      item.senderId === currentUser.uid ? item.receiverId : item.senderId;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate("ChatDetails", { chatId: item.id })}
      >
        <Text style={styles.chatText}>
          Chat om "{item.bookTitle}" med: {otherUserId}
        </Text>
        <Text style={styles.messageText}>
          {messagePrefix} {item.message}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>Dine Chats</Text>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
        />
      ) : (
        <Text style={styles.noChatsText}>Ingen chats fundet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chatList: {
    marginTop: 10,
  },
  chatItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  chatText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 14,
    color: "#757575",
    marginTop: 5,
  },
  noChatsText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#757575",
  },
});
