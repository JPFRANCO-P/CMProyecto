import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [playerName, setPlayerName] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.getItem('playerName').then((name) => {
        setPlayerName(name);
      });
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('playerName');
    await AsyncStorage.removeItem('playerPass');
    setPlayerName(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {playerName ? `¡Bienvenido, ${playerName}!` : 'Escoge un nivel:'}
      </Text>

      {!playerName ? (
        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button2} onPress={handleLogout}>
          <Text style={styles.text}>Cerrar Sesión</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EZ')}>
        <Text style={styles.text}>EZ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Medio')}>
        <Text style={styles.text}>1/2</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Fullstack')}>
        <Text style={styles.text}>Fullstack</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tryhard')}>
        <Text style={styles.text}>1v1</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('TopGlobales')}>
        <Text style={styles.text}>TOP GLOBALES</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbdbbf'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#fe5f00',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
    alignItems: 'center'
  },
  button2: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
});
