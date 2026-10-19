const { Client } = require('ssh2');
const dotenv = require('dotenv');

dotenv.config();

const sshHost = process.env.SSH_HOST || '2.24.200.44';
const sshUser = process.env.SSH_USER || 'neha_developer';
const sshPassword = process.env.SSH_PASSWORD || 'Neha@123';

const conn = new Client();
conn.on('ready', () => {
  const cmd = `cat << 'EOF' > /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server/.env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=neha_user
DB_PASSWORD=neha_password
DB_NAME=Neha_data
PORT=5004
EOF
/usr/local/bin/pm2 delete cards-server || true
cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server && PORT=5004 /usr/local/bin/pm2 start start-server.js --name "cards-server"
/usr/local/bin/pm2 save
sleep 2
curl -s http://localhost:5004/health

`;

  conn.exec(cmd, (err, stream) => {
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
