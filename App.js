import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import NivelEz from './screens/NivelEz';
import Medio from './screens/Medio';
import Fullstack from './screens/Fullstack';
import Tryhard from './screens/Tryhard';
import Login from './screens/Login';
import TopGlobales from './screens/TopGlobales';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#fe5f00' },
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: '900', fontSize: 22 },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'REFLEX' }} />
        <Stack.Screen name="EZ" component={NivelEz} />
        <Stack.Screen name="Medio" component={Medio} />
        <Stack.Screen name="Fullstack" component={Fullstack} />
        <Stack.Screen name="Tryhard" component={Tryhard} />
        <Stack.Screen name="TopGlobales" component={TopGlobales} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
