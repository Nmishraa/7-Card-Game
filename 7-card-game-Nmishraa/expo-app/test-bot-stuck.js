const { chromium } = require('playwright');

async function runTest() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[Browser Page Error] ${err.toString()}`));

  try {
    console.log("Navigating to https://card-game-47016.web.app...");
    await page.goto('https://card-game-47016.web.app');
    await page.waitForTimeout(2000);

    console.log("Clicking 'Play as Guest'...");
    await page.click('text=Play as Guest');
    await page.waitForTimeout(3000);

    console.log("Entering name 'Player1'...");
    await page.fill('input[placeholder="e.g. Bill"]', 'Player1');

    console.log("Clicking 'Play vs Computer'...");
    await page.click('text=Play vs Computer');
    await page.waitForTimeout(3000);

    console.log("Starting game...");
    await page.click('text=Start Game');
    await page.waitForTimeout(5000);

    console.log("Checking game state...");
    const content = await page.content();
    console.log("Page content includes 'Discard' button?", content.includes('Discard'));
    console.log("Page content includes 'Least!'?", content.includes('Least!'));

    // Wait 15 seconds to let bot turns play out if it is bot's turn
    console.log("Waiting 15 seconds to observe turns...");
    await page.waitForTimeout(15000);

    await page.screenshot({ path: 'bot_stuck_check.png' });
    console.log("Screenshot saved: bot_stuck_check.png");

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await browser.close();
    console.log("Closed.");
  }
}

runTest();
