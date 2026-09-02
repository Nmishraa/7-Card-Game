const { Client } = require('ssh2');
const dotenv = require('dotenv');

dotenv.config();

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
      stream.on('close', () => {
        resolve(stdout || stderr);
      }).on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data.toString());
      });
    });
  });
}

async function update() {
  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect({
      host: sshHost,
      port: 22,
      username: sshUser,
      password: sshPassword,
    });
  });

  console.log(`[Deploy Nav] Connected to ${sshUser}@${sshHost}!`);

  await execCommand(
    conn,
    `cd /home/neha_developer/7-Card-Game && git fetch origin && git reset --hard origin/main`
  );

  await execCommand(
    conn,
    `chmod 755 /home/neha_developer && chmod -R 755 /home/neha_developer/7-Card-Game`
  );

  await execCommand(
    conn,
    `cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server && npm run build`
  );

  await execCommand(
    conn,
    `fuser -k 5004/tcp || pkill -f "node start-server.js" || true`
  );

  await execCommand(
    conn,
    `cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server && nohup node start-server.js > server.log 2>&1 &`
  );

  await new Promise((r) => setTimeout(r, 2000));

  console.log('\n[Testing Health Check]');
  await execCommand(conn, `curl -s http://localhost:5004/health`);

  conn.end();
  console.log('\n✅ Deployment Navigation Fix Applied Successfully!');
}

update().catch(console.error);
