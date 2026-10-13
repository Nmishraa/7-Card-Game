const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, 'assets_presentation');
const imgDir = path.join(__dirname, 'slide_images');
const pdfPath = path.join(__dirname, '..', '7-Cards-Least-Game-Presentation.pdf');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Convert images to base64 for standalone HTML rendering
const getBase64Img = (filename) => {
  const fileP = path.join(assetsDir, filename);
  if (fs.existsSync(fileP)) {
    const data = fs.readFileSync(fileP).toString('base64');
    return `data:image/png;base64,${data}`;
  }
  return '';
};

const homeImg = getBase64Img('home_screen.png');
const aiGameplayImg = getBase64Img('ai_gameplay.png');
const mpImg = getBase64Img('multiplayer_screen.png');
const lobbyImg = getBase64Img('lobby_screen.png');
const playAiImg = getBase64Img('play_ai_screen.png');
const rulesImg = getBase64Img('rules_screen.png');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #030712; color: #ffffff; }
    .slide {
      width: 1920px;
      height: 1080px;
      position: relative;
      overflow: hidden;
      background: #07160C;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      padding: 60px 80px;
    }
    
    /* Global Slide Styles */
    .badge {
      font-size: 16px;
      font-weight: 800;
      color: #EAB308;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .slide-title {
      font-size: 40px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 30px;
      line-height: 1.2;
    }
    .card-panel {
      background: #0A1628;
      border: 2px solid #1E3A5A;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .card-panel-green {
      border-color: #16A34A;
      box-shadow: 0 20px 40px rgba(22, 163, 74, 0.2);
    }
    .card-panel-gold {
      border-color: #EAB308;
      box-shadow: 0 20px 40px rgba(234, 179, 8, 0.2);
    }
    .card-panel-cyan {
      border-color: #38BDF8;
      box-shadow: 0 20px 40px rgba(56, 189, 248, 0.2);
    }
    .text-gold { color: #EAB308; }
    .text-green { color: #10B981; }
    .text-cyan { color: #38BDF8; }
    .text-light { color: #CBD5E1; }
    .text-muted { color: #94A3B8; }

    /* Slide 1 Hero Layout */
    .hero-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
      height: 100%;
    }
    .hero-left h1 { font-size: 64px; font-weight: 900; line-height: 1.1; margin-bottom: 24px; }
    .hero-left p { font-size: 22px; color: #CBD5E1; line-height: 1.6; margin-bottom: 36px; }
    .hero-url { font-size: 20px; font-weight: 700; color: #38BDF8; background: rgba(56,189,248,0.1); padding: 12px 24px; border-radius: 12px; display: inline-block; border: 1px solid rgba(56,189,248,0.3); }
    .hero-img { width: 100%; border-radius: 16px; border: 3px solid #16A34A; box-shadow: 0 25px 50px rgba(0,0,0,0.6); }

    /* Grid Layouts */
    .grid-2x2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      flex: 1;
    }
    .grid-left-right {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 40px;
      flex: 1;
      align-items: center;
    }

    .feature-item { margin-bottom: 20px; }
    .feature-item h3 { font-size: 22px; font-weight: 700; color: #EAB308; margin-bottom: 8px; }
    .feature-item p { font-size: 16px; color: #CBD5E1; line-height: 1.5; }

    .step-num {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #16A34A;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: Hero Cover -->
  <div class="slide" id="slide1">
    <div class="card-panel card-panel-green hero-container" style="height: 100%; padding: 60px;">
      <div class="hero-left">
        <div class="badge">🎴 ONLINE CARD GAME</div>
        <h1>7 Cards Least</h1>
        <p style="font-size: 32px; font-weight: 700; color: #EAB308; margin-bottom: 20px;">“Play Smart. Keep Your Score Low. Have More Fun.”</p>
        <p>The fast-paced online shedding card game where lowest score wins. Play solo against computer AI or host private multiplayer rooms with friends.</p>
        <div class="hero-url">🌐 PLAY FREE: cards.gnanamai.com</div>
      </div>
      <div class="hero-right">
        <img src="${homeImg}" class="hero-img" alt="Home Screen">
      </div>
    </div>
  </div>

  <!-- SLIDE 2: Meet the Game -->
  <div class="slide" id="slide2">
    <div class="badge">02 / ABOUT THE GAME</div>
    <div class="slide-title">Meet 7 Cards Least: The Lowest Score Card Game</div>
    <div class="grid-left-right">
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="card-panel card-panel-gold">
          <h3 style="font-size: 22px; color: #EAB308; font-weight: 800; margin-bottom: 8px;">🎯 Objective: Lowest Score</h3>
          <p class="text-light" style="font-size: 17px; line-height: 1.6;">Unlike traditional card games where accumulating high points wins, 7 Cards Least flips the mechanics: finish with the LEAST points to win.</p>
        </div>
        <div class="card-panel">
          <h3 style="font-size: 22px; color: #38BDF8; font-weight: 800; margin-bottom: 8px;">⚡ 100% Free & Browser-Based</h3>
          <p class="text-light" style="font-size: 17px; line-height: 1.6;">Play instantly on desktop, mobile, or tablet. No app store downloads, logins, or installation friction required.</p>
        </div>
        <div class="card-panel card-panel-green">
          <h3 style="font-size: 22px; color: #10B981; font-weight: 800; margin-bottom: 8px;">🤖 Solo AI & Multiplayer</h3>
          <p class="text-light" style="font-size: 17px; line-height: 1.6;">Practice anytime against 3 smart computer bots (AlphaBot, BetaBot, OmegaBot) or create private 4-digit code tables for friends.</p>
        </div>
      </div>
      <div>
        <img src="${homeImg}" class="hero-img" alt="Meet Game">
      </div>
    </div>
  </div>

  <!-- SLIDE 3: How to Play -->
  <div class="slide" id="slide3">
    <div class="badge">03 / RULES & FLOW</div>
    <div class="slide-title">How to Play: Turn-by-Turn Gameplay Flow</div>
    <div class="grid-2x2">
      <div class="card-panel">
        <div class="step-num">1</div>
        <h3 style="font-size: 22px; color: #EAB308; font-weight: 800; margin-bottom: 8px;">Deal 7 Cards & Set Joker</h3>
        <p class="text-light" style="font-size: 17px; line-height: 1.6;">7 cards dealt per player. 1 face-up card sets the zero-point Joker rank for the round; 1 starts the Discard Pile.</p>
      </div>
      <div class="card-panel">
        <div class="step-num">2</div>
        <h3 style="font-size: 22px; color: #38BDF8; font-weight: 800; margin-bottom: 8px;">Discard Phase First</h3>
        <p class="text-light" style="font-size: 17px; line-height: 1.6;">Select 1 single card, equal rank set (e.g. 8-8-8), or suited run (e.g. 4♣-5♣-6♣) to drop on the Discard Pile.</p>
      </div>
      <div class="card-panel">
        <div class="step-num">3</div>
        <h3 style="font-size: 22px; color: #10B981; font-weight: 800; margin-bottom: 8px;">Draw Phase Next</h3>
        <p class="text-light" style="font-size: 17px; line-height: 1.6;">Draw 1 replacement card from either the face-down Draw Deck or the top face-up card of the Discard Pile.</p>
      </div>
      <div class="card-panel card-panel-gold">
        <div class="step-num" style="background: #EAB308; color: #000;">4</div>
        <h3 style="font-size: 22px; color: #EAB308; font-weight: 800; margin-bottom: 8px;">Declare LEAST!</h3>
        <p class="text-light" style="font-size: 17px; line-height: 1.6;">When hand sum is ≤ 10 points, call LEAST! Lowest score wins round (0 pts). Equal or higher call incurs 80-pt penalty!</p>
      </div>
    </div>
  </div>

  <!-- SLIDE 4: The Strategy -->
  <div class="slide" id="slide4">
    <div class="badge">04 / STRATEGY & TACTICS</div>
    <div class="slide-title">Strategic Card Shedding & Scoring Rules</div>
    <div class="grid-2x2">
      <div class="card-panel" style="grid-row: span 2;">
        <h3 style="font-size: 24px; color: #EAB308; margin-bottom: 20px;">🎴 Card Point Values</h3>
        <div class="feature-item"><h3>Ace (A)</h3><p>1 Point (Best standard low card)</p></div>
        <div class="feature-item"><h3>Cards 2 to 10</h3><p>Face Value (2–10 penalty points)</p></div>
        <div class="feature-item"><h3>Face Cards (J, Q, K)</h3><p>10 Points each (Heavy point liability!)</p></div>
        <div class="feature-item"><h3>Table Joker Rank</h3><p>0 Points (Wildcard setup rank)</p></div>
        <div class="feature-item"><h3>Least Threshold</h3><p>Hand sum must be ≤ 10 Points</p></div>
      </div>
      <div class="card-panel card-panel-green">
        <h3 style="font-size: 22px; color: #10B981; margin-bottom: 10px;">💡 Early Face Card Dump</h3>
        <p class="text-light" style="font-size: 17px;">Discard J, Q, K in turns 1–3 to avoid getting caught with 10-point penalties when opponents call Least.</p>
      </div>
      <div class="card-panel card-panel-cyan">
        <h3 style="font-size: 22px; color: #38BDF8; margin-bottom: 10px;">🃏 Zero-Point Joker Preservation</h3>
        <p class="text-light" style="font-size: 17px;">Hold Table Jokers to guarantee low hand totals and execute unchallengeable Least declarations.</p>
      </div>
    </div>
  </div>

  <!-- SLIDE 5: Play Against AI -->
  <div class="slide" id="slide5">
    <div class="badge">05 / SINGLEPLAYER MODE</div>
    <div class="slide-title">Singleplayer Mode: Play Against Computer AI</div>
    <div class="grid-left-right">
      <div class="card-panel card-panel-gold">
        <h3 style="font-size: 24px; color: #EAB308; margin-bottom: 16px;">🤖 Smart AI Opponents</h3>
        <div class="feature-item"><h3>Intelligent Bot Logic</h3><p>AlphaBot 🤖, BetaBot 🤖, and OmegaBot 🤖 evaluate optimal set combinations and card shedding.</p></div>
        <div class="feature-item"><h3>Instant Solo Practice</h3><p>Zero queue times or player waiting. Jump into a fast-paced game instantly in your browser.</p></div>
        <div class="feature-item"><h3>Realistic Strategy</h3><p>Bots track table discards, hold zero-point Jokers, and declare Least strategically.</p></div>
      </div>
      <div>
        <img src="${aiGameplayImg}" class="hero-img" alt="AI Gameplay">
      </div>
    </div>
  </div>

  <!-- SLIDE 6: Play With Friends -->
  <div class="slide" id="slide6">
    <div class="badge">06 / MULTIPLAYER</div>
    <div class="slide-title">Multiplayer: Play With Friends & Family</div>
    <div class="grid-left-right">
      <div>
        <img src="${mpImg}" class="hero-img" alt="Multiplayer Screen">
      </div>
      <div class="card-panel card-panel-green">
        <h3 style="font-size: 24px; color: #10B981; margin-bottom: 16px;">🎮 Real-Time Multiplayer</h3>
        <div class="feature-item"><h3>Private Room Codes</h3><p>Create a private lobby and generate a 4-digit room code for instant access.</p></div>
        <div class="feature-item"><h3>WhatsApp Invites</h3><p>Share direct room links via WhatsApp to invite friends and family in 1 click.</p></div>
        <div class="feature-item"><h3>Live Table Chat</h3><p>Send real-time chat messages and reactions during table play.</p></div>
      </div>
    </div>
  </div>

  <!-- SLIDE 7: Game Experience -->
  <div class="slide" id="slide7">
    <div class="badge">07 / USER EXPERIENCE</div>
    <div class="slide-title">The Game Experience: Interface & Table Mechanics</div>
    <div class="grid-left-right">
      <div class="card-panel">
        <h3 style="font-size: 24px; color: #38BDF8; margin-bottom: 16px;">🌟 Premium Table UI</h3>
        <div class="feature-item"><h3>Felt Table Themes</h3><p>Select custom felt table colors (Classic Emerald Green, Midnight Dark, Velvet Red).</p></div>
        <div class="feature-item"><h3>Turn Banners & Animations</h3><p>Clear phase guidance with smooth card draw and discard flight physics.</p></div>
        <div class="feature-item"><h3>Hand Sorting Tool</h3><p>One-touch "Sort Cards" button automatically arranges hand by sequence rank and suit order.</p></div>
      </div>
      <div>
        <img src="${lobbyImg}" class="hero-img" alt="Lobby Screen">
      </div>
    </div>
  </div>

  <!-- SLIDE 8: Why Play -->
  <div class="slide" id="slide8">
    <div class="badge">08 / VALUE PROPOSITION</div>
    <div class="slide-title">Why Play 7 Cards Least? Key Value Pillars</div>
    <div class="grid-2x2">
      <div class="card-panel card-panel-green">
        <h3 style="font-size: 22px; color: #10B981; margin-bottom: 10px;">🌐 100% Free Web App</h3>
        <p class="text-light" style="font-size: 17px;">Play instantly in any desktop, tablet, or mobile web browser. Zero app downloads, zero installation friction.</p>
      </div>
      <div class="card-panel card-panel-gold">
        <h3 style="font-size: 22px; color: #EAB308; margin-bottom: 10px;">⚡ Thrilling Inverted Mechanics</h3>
        <p class="text-light" style="font-size: 17px;">Reverses traditional card scoring: shedding high cards and managing hand points creates intense strategic play.</p>
      </div>
      <div class="card-panel card-panel-cyan">
        <h3 style="font-size: 22px; color: #38BDF8; margin-bottom: 10px;">👥 Solo & Social Modes</h3>
        <p class="text-light" style="font-size: 17px;">Switch seamlessly between fast singleplayer AI practice and private multiplayer rooms with family and friends.</p>
      </div>
      <div class="card-panel">
        <h3 style="font-size: 22px; color: #FFFFFF; margin-bottom: 10px;">🎨 Modern Dark Mode UI</h3>
        <p class="text-light" style="font-size: 17px;">Polished dark emerald aesthetic, clear card typography, realistic card physics, and smooth sound effects.</p>
      </div>
    </div>
  </div>

  <!-- SLIDE 9: Start Playing -->
  <div class="slide" id="slide9" style="align-items: center; justify-content: center;">
    <div class="card-panel card-panel-green" style="width: 100%; text-align: center; padding: 60px;">
      <div class="badge">09 / CALL TO ACTION</div>
      <h1 style="font-size: 54px; font-weight: 900; margin-bottom: 16px;">⚡ YOUR NEXT GAME STARTS HERE</h1>
      <p style="font-size: 36px; font-weight: 800; color: #38BDF8; margin-bottom: 40px;">cards.gnanamai.com</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: left;">
        <div class="card-panel card-panel-cyan" style="background: #07160C;">
          <h3 style="font-size: 24px; color: #38BDF8; margin-bottom: 10px;">🤖 Practice vs Computer AI</h3>
          <p class="text-light" style="font-size: 18px;">Start instant solo match against computer bots with zero wait time.</p>
        </div>
        <div class="card-panel card-panel-gold" style="background: #07160C;">
          <h3 style="font-size: 24px; color: #EAB308; margin-bottom: 10px;">🎮 Play With Friends</h3>
          <p class="text-light" style="font-size: 18px;">Host a private table, generate a 4-digit room code, and share via WhatsApp.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- SLIDE 10: Closing -->
  <div class="slide" id="slide10" style="align-items: center; justify-content: center;">
    <div class="card-panel card-panel-gold" style="width: 100%; text-align: center; padding: 80px;">
      <div class="badge">10 / CONCLUSION</div>
      <h1 style="font-size: 48px; font-weight: 900; margin-bottom: 30px; line-height: 1.3;">
        “Gather Your Players.<br>
        Play Your Cards.<br>
        <span class="text-gold">Go for the Lowest Score.</span>”
      </h1>
      <p style="font-size: 24px; font-weight: 700; color: #38BDF8;">Thank You! Play online at https://cards.gnanamai.com/</p>
    </div>
  </div>

</body>
</html>
`;

(async () => {
  console.log('[Puppeteer] Exporting presentation PDF & slide PNGs...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.setContent(htmlContent, { waitUntil: 'load' });

  // 1. Export PDF Presentation
  console.log(`[Puppeteer] Saving PDF presentation: ${pdfPath}`);
  await page.pdf({
    path: pdfPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  // 2. Export 10 PNG Slide Screenshots
  console.log('[Puppeteer] Capturing 10 slide PNG images...');
  for (let i = 1; i <= 10; i++) {
    const slideElem = await page.$(`#slide${i}`);
    const imgPath = path.join(imgDir, `slide_${i.toString().padStart(2, '0')}.png`);
    await slideElem.screenshot({ path: imgPath });
    console.log(`  Saved: slide_${i.toString().padStart(2, '0')}.png`);
  }

  await browser.close();
  console.log('[Puppeteer] PDF and slide images exported successfully!');
})();
