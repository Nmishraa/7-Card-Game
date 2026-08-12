const { chromium } = require('playwright');

async function runTest() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  
  // Create two separate browser contexts to simulate two different users
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  // Log console messages from both pages
  pageA.on('console', msg => console.log(`[Host Console] ${msg.type()}: ${msg.text()}`));
  pageB.on('console', msg => console.log(`[Guest Console] ${msg.type()}: ${msg.text()}`));

  try {
    console.log("Navigating Page A to https://card-game-47016.web.app...");
    await pageA.goto('https://card-game-47016.web.app');
    console.log("Navigating Page B to https://card-game-47016.web.app...");
    await pageB.goto('https://card-game-47016.web.app');

    await pageA.waitForTimeout(2000);
    await pageB.waitForTimeout(2000);

    // Login as guest on both pages
    console.log("Clicking 'Play as Guest' on Host...");
    await pageA.click('text=Play as Guest');
    console.log("Clicking 'Play as Guest' on Guest...");
    await pageB.click('text=Play as Guest');

    await pageA.waitForTimeout(3500);
    await pageB.waitForTimeout(3500);

    // Enter names
    console.log("Entering name 'HostPlayer' on Host...");
    await pageA.fill('input[placeholder="e.g. Bill"]', 'HostPlayer');
    console.log("Entering name 'GuestPlayer' on Guest...");
    await pageB.fill('input[placeholder="e.g. Bill"]', 'GuestPlayer');

    // Host creates room
    console.log("Host clicks 'Create Private Table'...");
    await pageA.click('text=Create Private Table');
    await pageA.waitForTimeout(3000);

    // Read room code from Host page
    const roomCodeElement = await pageA.waitForSelector('text=Room Code:');
    const roomCodeText = await roomCodeElement.innerText();
    const roomCode = roomCodeText.replace('Room Code: ', '').trim();
    console.log(`Room Code generated: "${roomCode}"`);

    // Guest joins room
    console.log(`Guest enters Room Code "${roomCode}"...`);
    await pageB.fill('input[placeholder*="Room Code"]', roomCode);
    console.log("Guest clicks 'Join Table'...");
    await pageB.click('text=Join Table');
    await pageB.waitForTimeout(3000);

    // Host starts game
    console.log("Host clicks 'Start Game'...");
    await pageA.click('text=Start Game');
    await pageA.waitForTimeout(5000);

    console.log("Game started! Dumping page content...");
    const hostContent = await pageA.content();
    const guestContent = await pageB.content();

    console.log("Host has 'Least!' button visible?", hostContent.includes('Least!'));
    console.log("Guest has 'Least!' button visible?", guestContent.includes('Least!'));

    // Check hands and turn indicators
    const hostTurnText = await pageA.locator('text=Turn:').innerText().catch(() => 'No Turn Text');
    const guestTurnText = await pageB.locator('text=Turn:').innerText().catch(() => 'No Turn Text');
    console.log("Host Screen Turn Text:", hostTurnText);
    console.log("Guest Screen Turn Text:", guestTurnText);

    // Let's capture screenshots to verify visually if needed
    await pageA.screenshot({ path: 'host_game_start.png' });
    await pageB.screenshot({ path: 'guest_game_start.png' });
    console.log("Screenshots saved: host_game_start.png, guest_game_start.png");

  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

runTest();
