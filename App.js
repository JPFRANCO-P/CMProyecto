import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Menu({ onSelectLevel }) {
return (
<View style={styles.container}>
<Text style={styles.title}>Reflex</Text>
<Text style={styles.subtitle}>Elegir nivel:</Text>
<TouchableOpacity style={styles.levelButton} onPress={() => onSelectLevel('facil')}>
    <Text style={styles.levelText}>Ez</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.levelButton} onPress={() => onSelectLevel('medio')}>
    <Text style={styles.levelText}>1/2</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.levelButton} onPress={() => onSelectLevel('dificil')}>
    <Text style={styles.levelText}>FullStack de Google</Text>
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
fontSize: 26,
fontWeight: 'bold',
marginBottom: 20,
},
subtitle: {
fontSize: 20,
marginBottom: 15,
},
levelButton: {
backgroundColor: '#87ceeb',
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