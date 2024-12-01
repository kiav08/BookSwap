import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import globalStyles from "../styles/globalStyles";

const users = [
  {
    id: "1",
    name: "Julie",
    message: "Book: VØS",
    time: "Today",
    avatar: "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Photo.png",
  },
  {
    id: "2",

    message: "Book: Informationsteknologi",
    time: "2 days ago",
    avatar: "https://static.vecteezy.com/system/resources/thumbnails/008/846/297/small_2x/cute-boy-avatar-png.png",
  },
];

const Chat = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("chatmessages", { userName: item.name })}>
      <View style={globalStyles.itemContainer}>
        <Image source={{ uri: item.avatar }} style={globalStyles.avatar} />
        <View style={globalStyles.messageContainer}>
          <Text style={globalStyles.name}>{item.name}</Text>
          <Text style={globalStyles.message}>{item.message}</Text>
        </View>
        <Text style={globalStyles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={globalStyles.list}
    />
  );
};

export default Chat;
