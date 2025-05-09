import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import NivelEz from './NivelEz'; 

export default function App() {
  const [screen, setScreen] = useState('menu');

  const resetGame = () => {
    setScreen('menu');
  };

  if (screen === 'menu') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Juego de Reflejos</Text>
        <Text style={styles.subtitle}>Escoger nivel:</Text>

        <TouchableOpacity style={styles.Button1} onPress={() => setScreen('ez')}>
          <Text style={styles.text}>EZ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.Button1} onPress={() => alert('no implementado')}>
          <Text style={styles.text}>1/2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.Button3} onPress={() => alert('no implementado')}>
          <Text style={styles.text}>FullStack</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.Button2} onPress={() => alert('no implementado')}>
          <Text style={styles.text}>Tryhard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.Button2} onPress={() => alert('Top Globales aún no implementado')}>
          <Text style={styles.text}>Top Globales</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'ez') {
    return <NivelEz resetGame={resetGame} setScreen={setScreen} />;
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbdbbf', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000', 
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 15,
    color: '#000000',
  },
  Button1: {
    backgroundColor: '#FF7043', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
  },
  Button2: {
    backgroundColor: '#f15800', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
  },
  Button3: {
    backgroundColor: '#FF7043', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 35,
    width: 200,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF', 
    fontWeight: 'bold',
  },
});
