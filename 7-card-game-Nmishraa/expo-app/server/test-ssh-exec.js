const { Client } = require('ssh2');
const dotenv = require('dotenv');

dotenv.config();

const sshHost = process.env.SSH_HOST || '2.24.200.44';
const sshUser = process.env.SSH_USER || 'neha_developer';
const sshPassword = process.env.SSH_PASSWORD || 'Neha@123';

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server/server.log && sleep 1 && curl -v http://localhost:5002/health', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      conn.end();
      process.exit(0);
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: sshHost,
  port: 22,
  username: sshUser,
  password: sshPassword,
});
