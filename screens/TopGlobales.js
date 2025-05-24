import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function TopGlobales() {
  const [jugadores, setJugadores] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const cargarJugadores = () => {
    const statsRef = ref(db, 'jugadores/');
    onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arrayJugadores = Object.entries(data).map(([id, datos]) => ({
          id,
          ...datos,
        })).filter(j => j.nombre);

        arrayJugadores.sort((a, b) => (b.bestScoreEZ || 0) - (a.bestScoreEZ || 0));

        setJugadores(arrayJugadores);
      }
    });
  };

  useEffect(() => {
    cargarJugadores();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      cargarJugadores();
      setRefreshing(false);
    }, 1000);
  };

  const formatName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {jugadores.length === 0 ? (
        <Text style={styles.text}>Cargando...</Text>
      ) : (
        jugadores.map((jugador, index) => (
          <View key={jugador.id} style={styles.card}>
            <Text style={styles.name}>{index + 1}. {formatName(jugador.nombre)}</Text>

            <Text style={styles.score}>
              EZ - Score: {jugador.bestScoreEZ ?? 'N/A'} pts — Tiempo: {jugador.bestTimeEZ ?? 'N/A'} ms
            </Text>
            <Text style={styles.score}>
              Medio - Score: {jugador.bestScoreMedio ?? 'N/A'} pts — Tiempo: {jugador.bestTimeMedio ?? 'N/A'} ms
            </Text>
            <Text style={styles.score}>
              Fullstack - Score: {jugador.bestScoreFullstack ?? 'N/A'} pts — Tiempo: {jugador.bestTimeFullstack ?? 'N/A'} ms
            </Text>
            <Text style={styles.score}>
              Tryhard - Score: {jugador.bestScoreTryhard ?? 'N/A'} pts — Tiempo: {jugador.bestTimeTryhard ?? 'N/A'} ms
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity onPress={onRefresh} style={styles.reloadButton}>
        <Text style={styles.reloadText}>Recargar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    color: '#444',
  },
  text: {
    fontSize: 16,
  },
  reloadButton: {
    marginTop: 20,
    backgroundColor: '#ff9800',
    padding: 10,
    borderRadius: 8,
  },
  reloadText: {
    color: 'white',
    fontWeight: 'bold',
  },
});