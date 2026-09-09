const { Client } = require('ssh2');
const dotenv = require('dotenv');

dotenv.config();

const sshHost = process.env.SSH_HOST || '2.24.200.44';
const sshUser = process.env.SSH_USER || 'neha_developer';
const sshPassword = process.env.SSH_PASSWORD || 'Neha@123';

const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server/server.log', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.end();
      process.exit(0);
    }).on('data', (d) => console.log('STDOUT: ' + d)).stderr.on('data', (d) => console.log('STDERR: ' + d));
  });
}).connect({
  host: sshHost,
  port: 22,
  username: sshUser,
  password: sshPassword,
});
