import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../FirebaseConfig";
import globalStyles from "../styles/globalStyles";

export default function Chat({ navigation }) {
  const [chats, setChats] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const currentUser = auth.currentUser;

  // Fetch chats and book titles
  useEffect(() => {
    const db = getDatabase();
    const chatsRef = ref(db, "chats");
    const booksRef = ref(db, "books");

    // If user is not logged in, return
    if (!currentUser) {
      return;
    }
    // Fetch chats where the current user is either the sender or receiver of the chat
    const unsubscribeChats = onValue(chatsRef, (snapshot) => {
      // Get the data from the snapshot, which is a picture of the database at that moment
      const data = snapshot.val();
      // If there is data, filter the chats to only include chats where the current user is the sender or receiver
      if (data) {
        const filteredChats = Object.entries(data)
          .filter(
            ([, chat]) =>
              chat.senderId === currentUser.uid ||
              chat.receiverId === currentUser.uid
          )
          .map(([id, chat]) => ({ id, ...chat }));
        setChats(filteredChats);
      } else {
        // If there is no data, set chats to an empty array
        setChats([]);
      }
    });

    // Fetch all book titles
    const unsubscribeBooks = onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map book IDs to titles
        const titlesMap = {};
        // Iterate over each book in the data and store the title in the titlesMap
        Object.entries(data).forEach(([key, book]) => {
          // Use the database key as the ID
          titlesMap[key] = book.title;
        });
        // Store titles mapped to book IDs
        setBookTitles(titlesMap);
      }
    });
    return () => {
      unsubscribeChats();
      unsubscribeBooks();
    };
  }, [currentUser]);

  /* ============== WRITE CHATMESSAGES =============== */
  const renderChat = ({ item }) => {
    // Check if the current user is the sender of the chat
    const isSender = item.senderId === currentUser.uid;
    const messagePrefix = isSender ? "Mig:" : "Anmodning:";

    // Get the ID of the other user in the chat
    const otherUserId =
      item.senderId === currentUser.uid ? item.receiverId : item.senderId;

    // Return a chat item
    return (
      <TouchableOpacity style={styles.chatItem}>
        {/* Display the book title and the other user's ID */}
        <Text style={styles.chatText}>
          Chat om "{item.bookTitle}" med: {otherUserId}
        </Text>
        <Text style={styles.messageText}>
          {messagePrefix} {item.message}
        </Text>
      </TouchableOpacity>
    );
  };

  // If the user is not logged in, return a message
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Dine Chats</Text>
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


/* ==================== Styles ===================== */
const styles = StyleSheet.create({
  chatList: {
    marginTop: 10,
  },
  chatItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#DB8D16",
    marginBottom: 10,
  },
  chatText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  noChatsText: {
    marginTop: 20,
    fontSize: 20,
    textAlign: "center",
    color: "#8C806F",
    fontWeight: "bold",
  },
});
