import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Menu({ onSelectLevel }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reflex</Text>
      <Text style={styles.subtitle}>Escoger nivel:</Text>
      <TouchableOpacity style={styles.levelButton}>
        <Text style={styles.levelText}>Ez</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.levelButton}>
        <Text style={styles.levelText}>1/2</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.levelButton3}>
        <Text style={styles.levelText}>FullStack</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.levelButton2}>
        <Text style={styles.levelText}>Tryhard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.levelButton2}>
        <Text style={styles.levelText}>Top Globales</Text>
      </TouchableOpacity>
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

  title: {
  fontSize: 50,
  fontWeight: 'bold',
  marginBottom: 20,
  },

  subtitle: {
  fontSize: 20,
  marginBottom: 15,
  },

  levelButton: {
  backgroundColor: '#24c7cd',
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
  width: 200,
  alignItems: 'center',
  },

  levelButton3: {
    backgroundColor: '#24c7cd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 35,
    width: 200,
    alignItems: 'center',
    },

  levelButton2: {
    backgroundColor: '#ff001b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
    },

  levelText: {
  fontSize: 18,
  color: '#fff',
  fontWeight: 'bold',
  },

});