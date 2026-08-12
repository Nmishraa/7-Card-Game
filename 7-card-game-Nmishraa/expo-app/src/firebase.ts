import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBHXxFqLGmO-wN6B_Y7yTrblwg4nGu5gGo",
  authDomain: "card-game-47016.firebaseapp.com",
  databaseURL: "https://card-game-47016-default-rtdb.firebaseio.com",
  projectId: "card-game-47016",
  storageBucket: "card-game-47016.firebasestorage.app",
  messagingSenderId: "659046160652",
  appId: "1:659046160652:web:f2bfd0ea461cbd1fc59129"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
