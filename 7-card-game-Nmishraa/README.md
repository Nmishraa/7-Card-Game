# 7 Card Game

A modern, interactive multiplayer 7 Card Game built with Expo (React Native) for the frontend, Node.js & TypeScript for the backend server, and Firebase for real-time multiplayer syncing, authentication, and hosting.

This repository is ready to be uploaded to GitHub for **Nmishraa**.

---

## 🚀 Features

- **Real-Time Multiplayer**: Instant state updates and game rooms.
- **Bot Opponents**: Offline and solo-play capability with automated, intelligent bots.
- **Real-Time Chat**: Live messaging in multiplayer rooms.
- **Admin Dashboard**: Manage game rooms, view live analytics, active users, and API endpoints.
- **Modern UI/UX**: Premium aesthetics featuring clean layouts, smooth animations, custom sound service, and responsive design.
- **Analytics & History**: Track game history, player statistics, and match wins.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Expo](https://expo.dev/) (React Native Web)
- **Styling**: React Native Stylesheet, CSS variables, Modern layouts
- **Database / Real-Time**: Firebase Web SDK v10+

### Backend Server
- **Runtime**: Node.js (v20)
- **Framework**: Express.js with TypeScript
- **Database Administration**: Firebase Admin SDK
- **Security**: CORS, Zod validation, rate-limiter, JWT authentication

---

## 📂 Project Structure

```text
├── expo-app/                   # Frontend client
│   ├── assets/                 # Icons, backgrounds, and splash graphics
│   ├── src/
│   │   ├── engine/             # Core card game logic and rules engine
│   │   ├── history/            # History modal, win-tracking, analytics modals
│   │   ├── screens/            # Home, Lobby, Login, Game screens
│   │   └── firebase.ts         # Firebase configuration and initialization
│   ├── App.tsx                 # Main Expo entry point
│   ├── tsconfig.json           # Frontend TypeScript configuration
│   └── package.json
│
└── expo-app/server/            # Backend server
    ├── src/
    │   ├── controllers/        # Express handlers (rooms, auth, users, analytics)
    │   ├── db/                 # Database initialization and schemas
    │   ├── middleware/         # Auth, security, error handling middlewares
    │   └── routes/             # REST endpoints (rooms, notifications, admin)
    ├── package.json
    └── tsconfig.json
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 recommended)
- [npm](https://www.npmjs.com/) (installed with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nmishraa/7-card-game.git
   cd 7-card-game
   ```

2. Install dependencies for the frontend client:
   ```bash
   cd expo-app
   npm install
   ```

3. Install dependencies for the backend server:
   ```bash
   cd server
   npm install
   ```

### Running the Apps Locally

#### 📱 Run Frontend (Expo Web/Mobile)
Start the client application using:
```bash
cd expo-app
npm run web
```
This will launch the development server and bundle the web app, usually available at [http://localhost:8081](http://localhost:8081).

#### 🖥️ Run Backend Server
Start the development API server using:
```bash
cd expo-app/server
npm run dev
```
The server will start running on its configured port (typically port `3000` or as defined in `.env`).

---

## 🛡️ License

This project is licensed under the MIT License.
