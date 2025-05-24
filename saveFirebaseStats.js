import { db } from './firebaseConfig';
import { ref, push, update, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFirebaseStats = async (modo, nuevoValor) => {
  try {
    const name = (await AsyncStorage.getItem('playerName'))?.trim().toLowerCase();
    if (!name) return;

    const jugadoresRef = ref(db, 'jugadores');
    const snapshot = await get(jugadoresRef);

    let jugadorID = null;
    let jugadorActual = null;

    if (snapshot.exists()) {
      const data = snapshot.val();
      for (let key in data) {
        if (data[key].nombre === name) {
          jugadorID = key;
          jugadorActual = data[key];
          break;
        }
      }
    }

   const camposComparables = [
  'bestScoreEZ',
  'bestScoreMedio',
  'bestScoreFullstack',
  'bestScoreTryhard',
  'bestTimeEZ',
  'bestTimeMedio',
  'bestTimeFullstack',
  'bestTimeTryhard'
];


    const camposUltimoValor = [
      'EZ_total_score',
      'EZ_total_time'
    ];

    let debeActualizar = false;

    if (jugadorID) {
      const jugadorRef = ref(db, 'jugadores/' + jugadorID);

      if (camposComparables.includes(modo)) {
        const valorAnterior = jugadorActual?.[modo];

        if (
          valorAnterior === undefined ||
          (modo.includes('Score') && nuevoValor > valorAnterior) ||
          (modo.includes('Time') && nuevoValor < valorAnterior)
        ) {
          await update(jugadorRef, { [modo]: nuevoValor });
          debeActualizar = true;
        } else if (valorAnterior !== undefined) {
          console.log(`No se actualizó ${modo}: ${nuevoValor} no supera a ${valorAnterior}`);
        }
      }

      if (camposUltimoValor.includes(modo)) {
        await update(jugadorRef, { [modo]: nuevoValor });
        debeActualizar = true;
      }

    } else {
      const newRef = push(jugadoresRef);
      await update(newRef, {
        nombre: name,
        [modo]: nuevoValor,
      });
    }
  } catch (err) {
    console.log('Error al guardar en Firebase:', err);
  }
};
