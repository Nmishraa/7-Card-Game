const { Client } = require('ssh2');
const dotenv = require('dotenv');

dotenv.config();

const sshHost = process.env.SSH_HOST || '2.24.200.44';
const sshUser = process.env.SSH_USER || 'neha_developer';
const sshPassword = process.env.SSH_PASSWORD || 'Neha@123';

const conn = new Client();
conn.on('ready', async () => {
  console.log('[Start Node] Connected to server!');
  
  // Write .env with PORT=5004
  conn.exec("cat << 'EOF' > /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server/.env\nDB_HOST=127.0.0.1\nDB_PORT=5432\nDB_USER=neha_user\nDB_PASSWORD=neha_password\nDB_NAME=Neha_data\nPORT=5004\nEOF", (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.exec('fuser -k 5004/tcp || pkill -f "node start-server.js" || true', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          conn.exec('cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server && nohup node start-server.js > server.log 2>&1 &', (err, stream) => {
            if (err) throw err;
            stream.on('close', async () => {
              await new Promise(r => setTimeout(r, 2000));
              conn.exec('curl -s http://localhost:5004/health', (err, stream) => {
                if (err) throw err;
                stream.on('close', () => {
                  conn.end();
                  process.exit(0);
                }).on('data', (d) => console.log('STDOUT: ' + d));
              });
            });
          });
        });
      });
    });
  });
}).connect({
  host: sshHost,
  port: 22,
  username: sshUser,
  password: sshPassword,
});
