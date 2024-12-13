// colortheme: Green "#156056", brown "#8C806F", orange "#DB8D16"

import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    /* ========================= BASICS ========================= */

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0E5",
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "abadi",
    textAlign: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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

  text: {
    fontSize: 30,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },

  box: { //vrd ikke 
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    flexBasis: "40%",
    maxWidth: "50%",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  boxText: {
    color: "#000", // White text
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 13,
  },
  boxTextSmall: {
    color: "#000", // White text
    fontSize: 12,
    textAlign: "left",
    paddingBottom: 5,
  },
  boxTextPris: {
    color: "#000", // White text
    fontSize: 12,
    textAlign: "left",
    paddingBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
    width: "100%",
    alignSelf: "center",
    marginBottom: 10,
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
    height: "170",
    resizeMode: "cover",
    borderRadius: 5,
    marginBottom: 5,
  },
  sectionContainer: {
    borderRadius: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
    /* ========================= BACK BUTTON ========================= */

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
  gridContainers: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default globalStyles;
