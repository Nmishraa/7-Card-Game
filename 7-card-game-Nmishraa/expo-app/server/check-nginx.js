const { Client } = require('ssh2');
require('dotenv').config();

const sshHost = process.env.SSH_HOST || '2.24.200.44';
const sshUser = process.env.SSH_USER || 'neha_developer';
const sshPassword = process.env.SSH_PASSWORD || 'Neha@123';

function execCommand(conn, command) {
  return new Promise((resolve, reject) => {
    console.log(`\n[SSH Exec]: ${command}`);
    conn.exec(command, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', () => resolve(stdout || stderr)).on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data.toString());
      });
    });
  });
}

async function run() {
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect({
      host: sshHost, port: 22, username: sshUser, password: sshPassword,
    });
  });

  console.log('[Connected] Catting cards_gnanamai nginx config...');
  await execCommand(conn, `cat /etc/nginx/sites-available/cards_gnanamai`);

  conn.end();
}

run().catch(console.error);
