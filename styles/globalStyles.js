// colortheme: Green "#156056", brown "#8C806F", orange "#DB8D16"

import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0E5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'abadi',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'abadi',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default globalStyles;
