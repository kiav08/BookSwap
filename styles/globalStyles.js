// colortheme: Green "#156056", brown "#8C806F", orange "#DB8D16"

import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0E5', // Light background for the app
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark text for headings
    marginBottom: 10,
    fontFamily: 'abadi',
    textAlign: 'center',
  },
  filterBox: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff', // White background for filter box
    borderColor: '#8C806F', // Brown border
    borderWidth: 1,
    marginBottom: 20,
  },
  filterByText: {
    fontSize: 16,
    color: '#333', // Dark text for filter text
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#8C806F', // Brown border
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff', // White background
    marginBottom: 15, // Space between elements
    fontSize: 16,
    color: '#333', // Text color
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8C806F', // Brown border
    backgroundColor: '#fff', // White background
    marginBottom: 15, // Space between dropdown buttons
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#156056', // Dark text for dropdowns
    fontWeight: 'bold',
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    width: '100%',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#8C806F', // Brown border
    borderRadius: 10,
    backgroundColor: '#fff', // White background
    zIndex: 1000, // Ensure it overlays other elements
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Light gray divider
  },
  dropdownItemLast: {
    borderBottomWidth: 0, // Remove divider for the last item
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333', // Dark text for items
  },
  resetButton: {
    marginTop: 15,
    alignSelf: 'flex-start',
    backgroundColor: '#156056', // Green background
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#fff', // White text
    fontWeight: 'bold',
  },
  filterTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#E0E0E0', // Light gray for tags
    margin: 5,
  },
  filterTagText: {
    fontSize: 12,
    color: '#333', // Dark text for tags
  },
  filterTagClose: {
    marginLeft: 8,
    fontSize: 14,
    color: '#DB8D16', // Orange for close icon
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Space out book boxes
  },
  box: {
    width: '48%', // Two columns
    aspectRatio: 1, // Square boxes
    backgroundColor: '#DB8D16', // Orange background
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    header: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
    },
    messageList: {
      flex: 1,
      marginBottom: 10,
    },
    messageBubble: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
    },
    myMessage: {
      backgroundColor: "#964B00",
      alignSelf: "flex-end",
    },
    theirMessage: {
      backgroundColor: "#C4A484",
      alignSelf: "flex-start",
    },
    sender: {
      fontWeight: "bold",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderColor: "#ccc",
      padding: 10,
    },
    input: {
      flex: 1,
      borderColor: "#fff",
      borderWidth: 2,
      borderRadius: 20,
      paddingHorizontal: 15,
    },
    sendButton: {
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 20,
      marginLeft: 10,
    },
    sendButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    list: {
      flex: 1,
      backgroundColor: "#ff9f9",
    },
    itemContainer: {
      backgroundColor: "#fff",
      padding: 20,
      marginVertical: 10,
      marginHorizontal: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      flexDirection: "row",
      backgroundColor: "#fff",
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    messageContainer: {
      flex: 1,
    },
    name: {
      fontWeight: "bold",
      fontSize: 18,
      color: "#333",
    },
    message: {
      color: "#888",
      fontSize: 14,
      marginTop: 2,
    },
    time: {
      color: "#aaa",
      fontSize: 12,
    },
  
});

export default globalStyles;
