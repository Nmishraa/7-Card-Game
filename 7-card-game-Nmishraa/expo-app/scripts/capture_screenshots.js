const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, 'assets_presentation');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  console.log('[Puppeteer] Launching browser for authentic screenshot capture...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });

  // 1. Home Screen
  console.log('[Puppeteer] Capturing Home Screen...');
  await page.goto('https://cards.gnanamai.com/', { waitUntil: 'networkidle2' });
  await delay(2000);
  await page.screenshot({ path: path.join(outputDir, 'home_screen.png') });

  // 2. Play Against AI Page
  console.log('[Puppeteer] Capturing Play Against AI Page...');
  await page.goto('https://cards.gnanamai.com/play-against-ai', { waitUntil: 'networkidle2' });
  await delay(2000);
  await page.screenshot({ path: path.join(outputDir, 'play_ai_screen.png') });

  // 3. Start Live AI Game & Capture Active Table
  console.log('[Puppeteer] Capturing Live AI Gameplay Table...');
  await page.goto('https://cards.gnanamai.com/', { waitUntil: 'networkidle2' });
  await delay(1500);
  
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, div[role="button"], a, touchableopacity'));
    const target = buttons.find(b => b.innerText && (b.innerText.includes('Computer') || b.innerText.includes('Solo') || b.innerText.includes('Quick Match')));
    if (target) target.click();
  });
  await delay(3500);
  await page.screenshot({ path: path.join(outputDir, 'ai_gameplay.png') });

  // 4. Multiplayer Page
  console.log('[Puppeteer] Capturing Multiplayer Page...');
  await page.goto('https://cards.gnanamai.com/multiplayer', { waitUntil: 'networkidle2' });
  await delay(2000);
  await page.screenshot({ path: path.join(outputDir, 'multiplayer_screen.png') });

  // 5. Rules Page
  console.log('[Puppeteer] Capturing Official Rules Page...');
  await page.goto('https://cards.gnanamai.com/7-cards-least/rules', { waitUntil: 'networkidle2' });
  await delay(2000);
  await page.screenshot({ path: path.join(outputDir, 'rules_screen.png') });

  // 6. Private Lobby Creation
  console.log('[Puppeteer] Capturing Private Lobby Room...');
  await page.goto('https://cards.gnanamai.com/', { waitUntil: 'networkidle2' });
  await delay(1500);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, div[role="button"], a'));
    const target = buttons.find(b => b.innerText && (b.innerText.includes('Create Room') || b.innerText.includes('Host') || b.innerText.includes('Create')));
    if (target) target.click();
  });
  await delay(2500);
  await page.screenshot({ path: path.join(outputDir, 'lobby_screen.png') });

  await browser.close();
  console.log('[Puppeteer] All authentic screenshots successfully captured in scripts/assets_presentation/');
})();
