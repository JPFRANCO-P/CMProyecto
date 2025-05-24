import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Vibration } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { saveFirebaseStats } from '../saveFirebaseStats';

const { width, height } = Dimensions.get('window');

const NivelEz = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [showButton, setShowButton] = useState(false);
  const [reactionTime, setReactionTime] = useState(null); 
  const [startTime, setStartTime] = useState(null);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [bestReaction, setBestReaction] = useState(3000); // valor inicial alto por defecto
  const [bestScore, setBestScore] = useState(0);
  const timeoutRef = useRef(null);
  const soundRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      loadBestScore();
      loadSound();
      resetGame();
      return () => {
        clearTimeout(timeoutRef.current);
        unloadSound();
      };
    }, [])
  );

  const loadBestScore = async () => {
    const storedScore = await AsyncStorage.getItem('bestScoreEZ');
    const storedReaction = await AsyncStorage.getItem('bestTimeEZ');
    if (storedScore) setBestScore(parseInt(storedScore));
    if (storedReaction) setBestReaction(parseInt(storedReaction));
  };

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/lose.mp3')
    );
    soundRef.current = sound;
  };

  const unloadSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }
  };

  const playLoseSound = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  const resetGame = () => {
    setLives(3);
    setScore(0);
    setReactionTime(null);
    setShowButton(false);
    setTimeout(startRound, 2000);
  };

  const startRound = () => {
    const topMargin = 120;
    const bottomMargin = 100;
    const randomX = Math.random() * (width - 100);
    const randomY = topMargin + Math.random() * (height - 100 - topMargin - bottomMargin);
    setPosition({ x: randomX, y: randomY });
    setStartTime(Date.now());
    setShowButton(true);

    timeoutRef.current = setTimeout(() => {
      setShowButton(false);
      loseLife();
    }, 500);
  };

  const loseLife = () => {
    Vibration.vibrate(200);
    playLoseSound();
    setLives((prev) => {
      const updated = prev - 1;
      if (updated <= 0) {
        saveBestScore();
        Alert.alert('Juego terminado', `Puntaje final: ${score} puntos`);
      } else {
        setTimeout(startRound, 500);
      }
      return updated;
    });
  };

  const saveBestScore = async () => {
    const name = await AsyncStorage.getItem('playerName');
    console.log('Nombre detectado:', name);
    console.log('Puntaje:', score, 'Mejor tiempo:', bestReaction);

    if (!name) {
      Alert.alert('Error', 'No se encontró el nombre del jugador. ¿Estás logueado correctamente?');
      return;
    }

    if (score > bestScore) {
      await AsyncStorage.setItem('bestScoreEZ', score.toString());
      await saveFirebaseStats('bestScoreEZ', score);
      setBestScore(score);
      console.log('✅ Guardado puntaje');
    }

    if (bestReaction !== null) {
      const stored = await AsyncStorage.getItem('bestTimeEZ');
      const bestLocal = stored ? parseInt(stored) : null;
      if (!bestLocal || bestReaction < bestLocal) {
        await AsyncStorage.setItem('bestTimeEZ', bestReaction.toString());
        await saveFirebaseStats('bestTimeEZ', bestReaction);
        console.log('✅ Guardado tiempo');
      }
    }
  };

  const handlePress = () => {
    clearTimeout(timeoutRef.current);
    const endTime = Date.now();
    const time = endTime - startTime;
    setReactionTime(time);
    setShowButton(false);

    if (time < bestReaction) {
      setBestReaction(time);
    }

    const points = Math.max(0, 3000 - time);
    const newScore = score + points;
    setScore(newScore);

    setTimeout(startRound, 500);
  };

  const renderHearts = () => {
    const safeLives = Math.max(0, lives || 0);
    return (
      <View style={styles.heartsRow}>
        {[...Array(safeLives)].map((_, i) => (
          <Ionicons key={i} name="heart" size={28} color="red" style={{ marginHorizontal: 2 }} />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Puntaje: {score}</Text>
      <View style={styles.lives}>{renderHearts()}</View>
      {reactionTime !== null && (
        <Text style={styles.reaction}>Tiempo: {reactionTime} ms</Text>
      )}
      {showButton && (
        <TouchableOpacity
          style={[styles.button, { top: position.y, left: position.x }]}
          onPress={handlePress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d0f4de', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', 
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
  },
  lives: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  heartsRow: {
    flexDirection: 'row',
  },
  reaction: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    position: 'absolute',
    bottom: 60,
  },
  button: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1976d2', 
  },
});

export default NivelEz;
