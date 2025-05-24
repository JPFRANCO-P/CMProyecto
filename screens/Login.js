import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { ref, get, push, set } from 'firebase/database';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const user = username.trim().toLowerCase(); 

    if (!user || !password.trim()) {
      Alert.alert('ALTOOOO', 'Ingresa usuario y contraseña.');
      return;
    }

    try {
      const jugadoresRef = ref(db, 'jugadores');
      const snapshot = await get(jugadoresRef);
      let existingUser = null;

      if (snapshot.exists()) {
        const data = snapshot.val();
        for (let key in data) {
          if (data[key].nombre === user) {
            existingUser = { id: key, ...data[key] };
            break;
          }
        }
      }

      if (existingUser) {
        if (existingUser.contrasena !== password) {
          Alert.alert('Contraseña incorrecta', 'La contraseña no coincide para este usuario.');
          return;
        }

        // Usuario correcto
        await AsyncStorage.setItem('playerID', existingUser.id);
        await AsyncStorage.setItem('playerName', user);
        await AsyncStorage.setItem('playerPass', password);
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        // Nuevo usuario
        const newRef = push(jugadoresRef);
        await set(newRef, {
          nombre: user,
          contrasena: password,
        });
        await AsyncStorage.setItem('playerID', newRef.key);
        await AsyncStorage.setItem('playerName', user);
        await AsyncStorage.setItem('playerPass', password);
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    } catch (error) {
      console.log('Error en login:', error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.login} onPress={handleLogin}>
          <Text style={styles.loginText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcb177 ',
  },
  form: {
    width: 300,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  login: {
    backgroundColor: '#fe5f00',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  loginText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
