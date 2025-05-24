import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { saveFirebaseStats } from '../saveFirebaseStats';

const { width, height } = Dimensions.get('window');

export default function Tryhard() {
  const [pos1, setPos1] = useState({ x: 50, y: height / 4 });
  const [pos2, setPos2] = useState({ x: 50, y: (3 * height) / 4 });
  const [start1, setStart1] = useState(null);
  const [start2, setStart2] = useState(null);
  const [reaction1, setReaction1] = useState(null);
  const [reaction2, setReaction2] = useState(null);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [life1, setLife1] = useState(1);
  const [life2, setLife2] = useState(1);
  const [score1, setScore1] = useState(0);
  const [bestScore1, setBestScore1] = useState(0);
  const [bestTime1, setBestTime1] = useState(null);

  const timeoutRef1 = useRef(null);
  const timeoutRef2 = useRef(null);
  const gameOver = useRef(false);

  useEffect(() => {
    const loadBestStats = async () => {
      const s = await AsyncStorage.getItem('bestScoreTryhard');
      const t = await AsyncStorage.getItem('bestTimeTryhard');
      if (s) setBestScore1(parseInt(s));
      if (t) setBestTime1(parseInt(t));
    };
    loadBestStats();
    startPlayer1Round();
    startPlayer2Round();
    return () => {
      clearTimeout(timeoutRef1.current);
      clearTimeout(timeoutRef2.current);
    };
  }, []);

  const endGame = (loser) => {
    gameOver.current = true;
    setShow1(false);
    setShow2(false);
    Alert.alert(`Jugador ${loser} perdió`);
  };

  const startPlayer1Round = () => {
    if (gameOver.current) return;
    setTimeout(() => {
      const x = Math.random() * (width - 80);
      const y = Math.random() * (height / 2 - 100);
      setPos1({ x, y });
      setShow1(true);
      const now = Date.now();
      setStart1(now);
      timeoutRef1.current = setTimeout(() => {
        if (show1 && !gameOver.current) {
          setShow1(false);
          setLife1(0);
          endGame(1);
        }
      }, 700);
    }, 2000);
  };

  const startPlayer2Round = () => {
    if (gameOver.current) return;
    setTimeout(() => {
      const x = Math.random() * (width - 80);
      const y = Math.random() * (height / 2 - 100) + height / 2;
      setPos2({ x, y });
      setShow2(true);
      const now = Date.now();
      setStart2(now);
      timeoutRef2.current = setTimeout(() => {
        if (show2 && !gameOver.current) {
          setShow2(false);
          setLife2(0);
          endGame(2);
        }
      }, 700);
    }, 2000);
  };

  const handlePlayer1 = async () => {
    if (gameOver.current) return;
    clearTimeout(timeoutRef1.current);
    const reaction = Date.now() - start1;
    setReaction1(reaction);
    setShow1(false);

    const points = Math.max(0, 2000 - reaction);
    const newScore = score1 + points;
    setScore1(newScore);

    const name = await AsyncStorage.getItem('playerName');

    if (bestTime1 === null || reaction < bestTime1) {
      setBestTime1(reaction);
      await AsyncStorage.setItem('bestTimeTryhard', reaction.toString());
      if (name) await saveFirebaseStats('bestScoreTryhard', newScore);
    }

    if (newScore > bestScore1) {
      setBestScore1(newScore);
      await AsyncStorage.setItem('bestScoreTryhard', newScore.toString());
      if (name) await saveFirebaseStats('bestTimeTryhard', reaction);
    }

    if (life1 > 0) {
      setTimeout(() => startPlayer1Round(), 300);
    }
  };

  const handlePlayer2 = () => {
    if (gameOver.current) return;
    clearTimeout(timeoutRef2.current);
    const reaction = Date.now() - start2;
    setReaction2(reaction);
    setShow2(false);
    if (life2 > 0) {
      setTimeout(() => startPlayer2Round(), 300);
    }
  };

  const renderHearts = (life) => (
    <View style={styles.heartsRow}>
      {[...Array(life)].map((_, i) => (
        <Ionicons key={i} name="heart" size={20} color="red" style={{ marginHorizontal: 2 }} />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.halfScreen}>
        <View style={styles.centeredInfo}>
          {renderHearts(life1)}
          {reaction1 !== null && <Text style={styles.result}>Tiempo: {reaction1} ms</Text>}
        </View>
        {show1 && (
          <TouchableOpacity
            style={[styles.circle, { top: pos1.y, left: pos1.x }]}
            onPress={handlePlayer1}
          />
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.halfScreen}>
        {show2 && (
          <TouchableOpacity
            style={[styles.circle, { top: pos2.y - height / 2, left: pos2.x }]}
            onPress={handlePlayer2}
          />
        )}
        <View style={styles.centeredInfo}>
          {renderHearts(life2)}
          {reaction2 !== null && <Text style={styles.result}>Tiempo: {reaction2} ms</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe6',
  },
  halfScreen: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  divider: {
    height: 2,
    backgroundColor: 'black',
    width: '100%',
  },
  result: {
    fontSize: 16,
    marginTop: 4,
  },
  circle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF7043',
  },
  heartsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  centeredInfo: {
    alignItems: 'center',
  },
});
