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
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    flexBasis: "40%",
    maxWidth: "40%",
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
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#F0F0E5", // Light background for the app
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333", // Dark text for headings
      marginBottom: 10,
      textAlign: "center",
    },
    text: {
      fontSize: 30,
      color: "#333",
      marginBottom: 10,
      textAlign: "center",
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginTop: 20,
    },
    boxText: {
      color: "#000", // White text
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },
    boxTextSmall: {
      color: "#000", // White text
      fontSize: 12,
      textAlign: "center",
    },
    input: {
      height: 40,
      borderColor: "#8C806F", // Brown border
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 15,
      backgroundColor: "#fff", // White background
      marginBottom: 10,
      fontSize: 16,
      color: "#333", // Dark text
    },
    loginButton: {
      backgroundColor: "#156056", // Green background
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 30,
    },
    loginButtonText: {
      color: "#fff", // White text
      fontWeight: "bold",
      fontSize: 16,
    },
    createAccountButton: {
      backgroundColor: "#8C806F", // Brown background
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 30,
    },
    createAccountButtonText: {
      color: "#fff", // White text
      fontWeight: "bold",
      fontSize: 16,
    },
    logoutButton: {
      backgroundColor: "#DB8D16", // Orange background
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
    },
    logoutButtonText: {
      color: "#fff", // White text
      fontWeight: "bold",
      fontSize: 16,
    },
    separator: {
      height: 1,
      backgroundColor: "#000",
      marginVertical: 20,
      width: "100%",
      alignSelf: "center",
      marginBottom: 20,
    },
    addButton: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
    },
    addButtonText: {
      color: "0000",
      fontWeight: "bold",
      fontSize: 16,
    },
    bookImage: {
      width: "100%",
      height: "150",
      resizeMode: "cover",
      borderRadius: 5,
      marginBottom: 10,
    },
    sectionContainer: {
      marginBottom: 10,
      borderRadius: 5,
      padding: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: "#333",
      marginBottom: 10,
    },
    stepContainer: {
      backgroundColor: "#D08D16",
      paddingVertical: 90,
      alignItems: "center",
      shadowColor: "#000",
      elevation: 5,
      marginBottom: 20,
      width: "100%",
    },
    highlightedSubtitleText: {
      fontSize: 24, 
      fontWeight: "bold", 
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 10, 
      textShadowColor: "#000000",
      textShadowRadius: 3, 
    },
    descriptionText: {
      fontSize: 14,
      fontWeight: "bold",
      fontStyle: "italic", 
      color: "#FFF5E1", 
      textAlign: "center",
    },
    gridContainers: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default globalStyles;
