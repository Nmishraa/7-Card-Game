"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var firebaseConfig = {
    apiKey: "AIzaSyBHXxFqLGmO-wN6B_Y7yTrblwg4nGu5gGo",
    authDomain: "card-game-47016.firebaseapp.com",
    databaseURL: "https://card-game-47016-default-rtdb.firebaseio.com",
    projectId: "card-game-47016",
    storageBucket: "card-game-47016.firebasestorage.app",
    messagingSenderId: "659046160652",
    appId: "1:659046160652:web:f2bfd0ea461cbd1fc59129"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, database_1.getDatabase)(app);
