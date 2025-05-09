import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Obtenemos el ancho y alto de la pantalla

const NivelEz = ({ resetGame, setScreen }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 }); // boton de reflejo
  const [showButton, setShowButton] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      moveButton();
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

  const moveButton = () => {
    const randomX = Math.random() * (width - 100); // - 100 para evitar que el botón esté fuera de la pantalla
    const randomY = Math.random() * (height - 200); // - 200 para evitar que el botón esté fuera de la pantalla
    setPosition({ x: randomX, y: randomY });
    setShowButton(true); 
    setStartTime(Date.now()); 
  };

  const handlePress = () => {
    const endTime = Date.now();
    const time = endTime - startTime;
    setReactionTime(time); 
    setShowButton(false); 
    setTimeout(() => {
      moveButton();
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {reactionTime !== null && (
        <Text style={styles.reaction}>Tiempo de reacción: {reactionTime} ms</Text>
      )}
      {showButton && (
        <TouchableOpacity
          style={[styles.button, { top: position.y, left: position.x }]}
          onPress={handlePress}
        />
      )}
      <TouchableOpacity onPress={() => setScreen('menu')} style={styles.Bbutton}>
        <Text style={styles.text}>Regresar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reaction: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00e5ff',
  },
  Bbutton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default NivelEz;
