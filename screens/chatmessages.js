import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";

const chatmessages = ({ route }) => {
  const { userName } = route.params;

  const [messages, setMessages] = useState([
    { id: "1", sender: userName, text: "Hi, I want to buy your book from VØS5." },
    { id: "2", sender: "You", text: "Great, what do you prefer? me sending it or meet up?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = { id: Date.now().toString(), sender: "You", text: newMessage };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        globalStyles.messageBubble,
        item.sender === "You" ? globalStyles.myMessage : globalStyles.theirMessage,
      ]}
    >
      <Text style={globalStyles.sender}>{item.sender}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.header}>Chat with {userName}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={globalStyles.messageList}
      />

      <View style={globalStyles.inputContainer}>
        <TextInput
          style={globalStyles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={globalStyles.sendButton} onPress={sendMessage}>
          <Text style={globalStyles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default chatmessages;
