const { Client } = require('ssh2');
require('dotenv').config();

const newNginxConfig = `server {
    listen 80;
    listen [::]:80;
    server_name cards.gnanamai.com www.cards.gnanamai.com;
    return 301 https://cards.gnanamai.com$request_uri;
}

server {
    listen [::]:443 ssl;
    listen 443 ssl;
    server_name cards.gnanamai.com;

    client_max_body_size 15M;

    # SEO 301 Permanent Redirects for legacy and duplicate alias paths
    location = /rules { return 301 https://cards.gnanamai.com/7-cards-least/rules; }
    location = /rules/ { return 301 https://cards.gnanamai.com/7-cards-least/rules; }
    location = /how-to-play { return 301 https://cards.gnanamai.com/7-cards-least/how-to-play; }
    location = /how-to-play/ { return 301 https://cards.gnanamai.com/7-cards-least/how-to-play; }
    location = /strategy { return 301 https://cards.gnanamai.com/7-cards-least/strategy; }
    location = /strategy/ { return 301 https://cards.gnanamai.com/7-cards-least/strategy; }
    location = /faq { return 301 https://cards.gnanamai.com/7-cards-least/faq; }
    location = /faq/ { return 301 https://cards.gnanamai.com/7-cards-least/faq; }
    location = /7cards-least { return 301 https://cards.gnanamai.com/7-cards-least; }
    location = /7cards-least/ { return 301 https://cards.gnanamai.com/7-cards-least; }
    location = /7cards-least- { return 301 https://cards.gnanamai.com/7-cards-least; }
    location = /7cards-least-/ { return 301 https://cards.gnanamai.com/7-cards-least; }
    location = /solo { return 301 https://cards.gnanamai.com/play-against-ai; }
    location = /solo/ { return 301 https://cards.gnanamai.com/play-against-ai; }
    location = /preview { return 301 https://cards.gnanamai.com/demo; }
    location = /preview/ { return 301 https://cards.gnanamai.com/demo; }

    location / {
        proxy_pass http://127.0.0.1:5004;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    ssl_certificate /etc/letsencrypt/live/cards.gnanamai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cards.gnanamai.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
`;

function execCommand(conn, command) {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', () => resolve(stdout || stderr))
        .on('data', (d) => { stdout += d.toString(); process.stdout.write(d.toString()); })
        .stderr.on('data', (d) => { stderr += d.toString(); process.stderr.write(d.toString()); });
    });
  });
}

async function run() {
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect({
      host: process.env.SSH_HOST || '2.24.200.44',
      port: 22,
      username: process.env.SSH_USER || 'neha_developer',
      password: process.env.SSH_PASSWORD || 'Neha@123'
    });
  });

  console.log('[1/4] Writing new nginx config to temp file...');
  // Write to remote temp file
  const base64Config = Buffer.from(newNginxConfig).toString('base64');
  await execCommand(conn, `echo "${base64Config}" | base64 -d > /tmp/cards_gnanamai.conf`);

  console.log('[2/4] Moving to /etc/nginx/sites-available/cards_gnanamai with sudo...');
  await execCommand(conn, `echo "Neha@123" | sudo -S cp /tmp/cards_gnanamai.conf /etc/nginx/sites-available/cards_gnanamai`);

  console.log('[3/4] Testing nginx configuration...');
  const testOut = await execCommand(conn, `echo "Neha@123" | sudo -S nginx -t`);
  if (!testOut.includes('successful')) {
    throw new Error('Nginx test failed: ' + testOut);
  }

  console.log('[4/4] Reloading nginx...');
  await execCommand(conn, `echo "Neha@123" | sudo -S systemctl reload nginx`);

  console.log('✅ Nginx 301 redirects successfully updated and reloaded!');
  conn.end();
}

run().catch(err => {
  console.error('Nginx update failed:', err);
  process.exit(1);
});
