import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC51B-3R3QlOrAFdL_3PWztu91oNe7J5V0",
  authDomain: "proyectoreflex-387b3.firebaseapp.com",
  databaseURL: "https://proyectoreflex-387b3-default-rtdb.firebaseio.com", 
  projectId: "proyectoreflex-387b3",
  storageBucket: "proyectoreflex-387b3.appspot.com",
  messagingSenderId: "34086759091",
  appId: "1:34086759091:web:8184cf67bdba62dd821ec6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
