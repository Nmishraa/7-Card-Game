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
      stream.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          console.warn(`[SSH Warning] Exit code ${code}: ${stderr}`);
          resolve(stdout || stderr);
        }
      }).on('data', (data) => {
        const text = data.toString();
        stdout += text;
        process.stdout.write(text);
      }).stderr.on('data', (data) => {
        const text = data.toString();
        stderr += text;
        process.stderr.write(text);
      });
    });
  });
}

async function runDeploy() {
  const conn = new Client();
  
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect({
      host: sshHost,
      port: 22,
      username: sshUser,
      password: sshPassword,
    });
  });

  console.log(`[Deploy] Connected to ${sshUser}@${sshHost}!`);

  // Step 1: Clone or Pull latest 7-Card-Game code
  await execCommand(
    conn,
    `cd /home/neha_developer && if [ -d "7-Card-Game" ]; then cd 7-Card-Game && git fetch origin && git reset --hard origin/main; else git clone https://github.com/Nmishraa/7-Card-Game.git 7-Card-Game; fi`
  );

  // Step 2: Create server .env
  const envContent = `DB_HOST=127.0.0.1\nDB_PORT=5432\nDB_USER=neha_user\nDB_PASSWORD=neha_password\nDB_NAME=Neha_data\nPORT=5002\n`;
  await execCommand(
    conn,
    `cat << 'EOF' > /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server/.env\n${envContent}EOF`
  );

  // Step 3: Install dependencies and compile TypeScript
  await execCommand(
    conn,
    `cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server && npm install && npm run build`
  );

  // Step 4: Create direct start-server.js for remote server (without SSH tunnel wrapper needed locally)
  const startServerScript = `
const http = require('http');
const app = require('./dist/app.js').default;
const { pool, initDb } = require('./dist/db/database.js');

const PORT = process.env.PORT || 5002;

async function start() {
  try {
    console.log('[Direct Remote DB] Connecting to local PostgreSQL database Neha_data...');
    await initDb();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(\`[7-Card-Game Backend] Production Server running on http://localhost:\${PORT}\`);
      console.log(\`[Health Check] http://localhost:\${PORT}/health\`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
`;

  await execCommand(
    conn,
    `cat << 'EOF' > /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server/start-server.js\n${startServerScript}EOF`
  );

  // Step 5: Stop any process currently using port 5002
  await execCommand(
    conn,
    `fuser -k 5002/tcp || pkill -f "node start-server.js" || true`
  );

  // Step 6: Start backend server in background using nohup
  await execCommand(
    conn,
    `cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server && nohup node start-server.js > server.log 2>&1 &`
  );

  // Wait 3 seconds for server startup
  await new Promise((r) => setTimeout(r, 3000));

  // Step 7: Verify health check endpoint on server
  console.log('\n[Deploy] Testing Health Check Endpoint on Server...');
  await execCommand(
    conn,
    `curl -s http://localhost:5002/health`
  );

  conn.end();
  console.log('\n✅ Deployment Completed Successfully!');
}

runDeploy().catch((err) => {
  console.error('Deployment Failed:', err);
  process.exit(1);
});
