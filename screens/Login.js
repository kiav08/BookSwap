//tror ikke vi bruger denne fil, men vil ikke slette den

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import globalStyles from "../styles/globalStyles";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>This is Login</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});