// colortheme: Green "#156056", brown "#8C806F", orange "#DB8D16"

import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0E5", // Light background for the app
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark text for headings
    marginBottom: 10,
    fontFamily: "abadi",
    textAlign: "center",
  },
  filterBox: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff", // White background for filter box
    borderColor: "#8C806F", // Brown border
    borderWidth: 1,
    marginBottom: 20,
  },
  filterByText: {
    fontSize: 16,
    color: "#333", // Dark text for filter text
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#8C806F", // Brown border
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff", // White background
    marginBottom: 15, // Space between elements
    fontSize: 16,
    color: "#333", // Text color
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8C806F", // Brown border
    backgroundColor: "#fff", // White background
    marginBottom: 15, // Space between dropdown buttons
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#156056", // Dark text for dropdowns
    fontWeight: "bold",
  },
  dropdownList: {
    position: "absolute",
    top: 50,
    width: "100%",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#8C806F", // Brown border
    borderRadius: 10,
    backgroundColor: "#fff", // White background
    zIndex: 1000, // Ensure it overlays other elements
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light gray divider
  },
  dropdownItemLast: {
    borderBottomWidth: 0, // Remove divider for the last item
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333", // Dark text for items
  },
  mainButton: {
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: "#156056", // Green background
    paddingVertical: 10,
    paddingHorizontal: 110,
    borderRadius: 10,
  },
  mainButtonText: {
    fontSize: 14,
    color: "#fff", // White text
    fontFamily: "abadi",
    fontWeight: "bold",
  },
  filterTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 10,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#E0E0E0", // Light gray for tags
    margin: 5,
  },
  filterTagText: {
    fontSize: 12,
    color: "#333", // Dark text for tags
  },
  filterTagClose: {
    marginLeft: 8,
    fontSize: 14,
    color: "#DB8D16", // Orange for close icon
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Space out book boxes
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 5,
    margin: 10,
    padding: 10,
    shadowColor: "#000",
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
    backgroundColor: "#8C806F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
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
    flex: 1,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8C806F",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "abadi",
    fontWeight: "bold",
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
  deliveryOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#156056",
  },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "blue",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  section: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
    backButton: {
    alignSelf: "flex-start",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#DB8D16",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default globalStyles;
