const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const sshHost = process.env.SSH_HOST || '2.24.200.44';
const sshUser = process.env.SSH_USER || 'neha_developer';
const sshPassword = process.env.SSH_PASSWORD || 'Neha@123';

const filesToUpload = [
  {
    local: path.join(__dirname, '../src/components/UserHeaderBadge.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/components/UserHeaderBadge.tsx'
  },
  {
    local: path.join(__dirname, '../src/components/SeoLink.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/components/SeoLink.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/HomeScreen.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/HomeScreen.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/GameScreen.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/GameScreen.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/LobbyScreen.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/LobbyScreen.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/LoginScreen.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/LoginScreen.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/SevenCardsLeastMainPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/SevenCardsLeastMainPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/SevenCardsLeastRulesPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/SevenCardsLeastRulesPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/SevenCardsLeastHowToPlayPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/SevenCardsLeastHowToPlayPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/SevenCardsLeastStrategyPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/SevenCardsLeastStrategyPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/SevenCardsLeastFaqPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/SevenCardsLeastFaqPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/PlayAgainstAiPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/PlayAgainstAiPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/MultiplayerPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/MultiplayerPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/DailyChallengePage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/DailyChallengePage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/StrategyLabPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/StrategyLabPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/ScoreCalculatorPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/ScoreCalculatorPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/VariationsPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/VariationsPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/FaqPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/FaqPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/SoloPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/SoloPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/RulesPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/RulesPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/HowToPlayPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/HowToPlayPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/StrategyPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/StrategyPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/NotFoundPage.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/NotFoundPage.tsx'
  },
  {
    local: path.join(__dirname, '../src/screens/PrivacyModal.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens/PrivacyModal.tsx'
  },
  {
    local: path.join(__dirname, '../src/engine/gameLogic.ts'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/engine/gameLogic.ts'
  },
  {
    local: path.join(__dirname, '../src/services/seoService.ts'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/services/seoService.ts'
  },
  {
    local: path.join(__dirname, '../public/sitemap.xml'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/public/sitemap.xml'
  },
  {
    local: path.join(__dirname, '../public/index.html'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/public/index.html'
  },
  {
    local: path.join(__dirname, '../public/logo-badge.png'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/public/logo-badge.png'
  },
  {
    local: path.join(__dirname, '../public/logo.png'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/public/logo.png'
  },
  {
    local: path.join(__dirname, '../assets/logo-badge.png'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/assets/logo-badge.png'
  },
  {
    local: path.join(__dirname, '../scripts/prerender.js'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/scripts/prerender.js'
  },
  {
    local: path.join(__dirname, '../public/404.html'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/public/404.html'
  },
  {
    local: path.join(__dirname, '../public/assets/logo.png'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/public/assets/logo.png'
  },
  {
    local: path.join(__dirname, '../App.tsx'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/App.tsx'
  },
  {
    local: path.join(__dirname, '../metro.config.js'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/metro.config.js'
  },
  {
    local: path.join(__dirname, '../test-game-flow.js'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/test-game-flow.js'
  },
  {
    local: path.join(__dirname, 'src/app.ts'),
    remote: '/home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server/src/app.ts'
  }
];

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

function uploadFile(sftp, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    console.log(`[SFTP Upload] ${localPath} -> ${remotePath}`);
    sftp.fastPut(localPath, remotePath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function run() {
  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect({
      host: sshHost,
      port: 22,
      username: sshUser,
      password: sshPassword,
    });
  });

  console.log(`[Deploy Sync] Connected to ${sshUser}@${sshHost}!`);

  await execCommand(
    conn,
    `mkdir -p /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/components /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/src/screens /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/assets /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/public /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/public/assets /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/dist/assets`
  );

  const sftp = await new Promise((resolve, reject) => {
    conn.sftp((err, s) => (err ? reject(err) : resolve(s)));
  });

  for (const item of filesToUpload) {
    if (fs.existsSync(item.local)) {
      await uploadFile(sftp, item.local, item.remote);
    } else {
      console.warn(`[Warning] Local file not found: ${item.local}`);
    }
  }

  console.log('\n[Building expo-app on remote server]...');
  await execCommand(
    conn,
    `cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app && npm run build`
  );

  console.log('\n[Building server on remote server]...');
  await execCommand(
    conn,
    `cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server && npm run build`
  );

  console.log('\n[Restarting server on port 5004]...');
  await execCommand(
    conn,
    `fuser -k 5004/tcp || pkill -f "node start-server.js" || true`
  );

  // Fire-and-forget: the detached server can keep the SSH channel open,
  // so don't wait for 'close' — give it a few seconds, then move on.
  await new Promise((resolve, reject) => {
    const cmd = `cd /home/neha_developer/7-Card-Game/7-card-game-Nmishraa/expo-app/server && PORT=5004 setsid nohup node start-server.js > server.log 2>&1 < /dev/null & disown`;
    console.log(`\n[SSH Exec (detached)]: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', () => {}).stderr.on('data', () => {});
      setTimeout(() => { try { stream.close(); } catch (_) {} resolve(); }, 3000);
    });
  });

  await new Promise((r) => setTimeout(r, 4000));

  console.log('\n[Testing Health Check]');
  await execCommand(conn, `curl -s http://localhost:5004/health`);

  console.log('\n[Testing FAQ page on cards.gnanamai.com]');
  await execCommand(conn, `curl -sI https://cards.gnanamai.com/7-cards-least/faq | head -n 5`);

  conn.end();
  console.log('\n✅ Deployment and Build on cards.gnanamai.com (Port 5004) Completed Successfully!');
}

run().catch((err) => {
  console.error('[Deploy Error]:', err);
  process.exit(1);
});
