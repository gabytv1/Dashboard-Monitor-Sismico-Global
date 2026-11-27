// Inicialización de Firebase: se ejecuta una sola vez y el resto de la app
// importa la instancia "database" desde aquí.
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyBglFU-916g9VlHUjr2yAvMc5brVBQ0j-w",
  authDomain: "monitor-sismico-global.firebaseapp.com",
  projectId: "monitor-sismico-global",
  storageBucket: "monitor-sismico-global.firebasestorage.app",
  messagingSenderId: "397217833396",
  appId: "1:397217833396:web:d89e43398f8c8c5f1052e1",
  databaseURL: "https://monitor-sismico-global-default-rtdb.firebaseio.com"
};


const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
