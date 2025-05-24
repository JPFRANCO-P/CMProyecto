import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { saveFirebaseStats } from '../saveFirebaseStats';

const { width, height } = Dimensions.get('window');

const Fullstack = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [showButton, setShowButton] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [lives, setLives] = useState(1);
  const [score, setScore] = useState(0);
  const [bestReaction, setBestReaction] = useState(null);
  const [bestScore, setBestScore] = useState(0);
  const timeoutRef = useRef(null);
  const soundRef = useRef(null);

  React.useEffect(() => {
    loadBestScore();
    loadSound();
    resetGame();
    return () => {
      clearTimeout(timeoutRef.current);
      unloadSound();
    };
  }, []);

  const loadBestScore = async () => {
    const storedScore = await AsyncStorage.getItem('bestScoreFullstack');
    const storedReaction = await AsyncStorage.getItem('bestTimeFullstack');
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
    setLives(1);
    setScore(0);
    setReactionTime(null);
    setShowButton(false);
    setTimeout(startRound, 3000);
  };

  const startRound = () => {
    const topMargin = 120;
    const bottomMargin = 100;
    const randomX = Math.random() * (width - 40);
    const randomY = topMargin + Math.random() * (height - 100 - topMargin - bottomMargin);
    setPosition({ x: randomX, y: randomY });
    setStartTime(Date.now());
    setShowButton(true);

    timeoutRef.current = setTimeout(() => {
      setShowButton(false);
      loseLife();
    }, 750); 
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
        setTimeout(startRound, 300);
      }
      return updated;
    });
  };

  const saveBestScore = async () => {
    const name = await AsyncStorage.getItem('playerName');

    if (score > bestScore) {
      await AsyncStorage.setItem('bestScoreFullstack', score.toString());
      if (name) await saveFirebaseStats('bestScoreFullstack', score);
      setBestScore(score);
    }

    if (bestReaction !== null) {
      const stored = await AsyncStorage.getItem('bestTimeFullstack');
      const bestLocal = stored ? parseInt(stored) : null;
      if (!bestLocal || bestReaction < bestLocal) {
        await AsyncStorage.setItem('bestTimeFullstack', bestReaction.toString());
        if (name) await saveFirebaseStats('bestTimeFullstack', bestReaction);
      }
    }
  };

  const handlePress = () => {
    clearTimeout(timeoutRef.current);
    const endTime = Date.now();
    const time = endTime - startTime;
    setReactionTime(time);
    setShowButton(false);

    if (bestReaction === null || time < bestReaction) {
      setBestReaction(time);
    }

    const points = Math.max(0, 2000 - time); 
    const newScore = score + points;
    setScore(newScore);

    setTimeout(startRound, 300); 
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
    backgroundColor: '#008df5', 
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0086e8', 
  },
});

export default Fullstack;
