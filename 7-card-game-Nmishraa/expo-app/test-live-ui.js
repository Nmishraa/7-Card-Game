const { chromium } = require('playwright');

async function testChat() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Navigating to https://card-game-47016.web.app...");
  await page.goto('https://card-game-47016.web.app');
  await page.waitForTimeout(2000);
  
  console.log("Clicking 'Play as Guest'...");
  await page.click('text=Play as Guest');
  await page.waitForTimeout(3500); // Wait for anonymous sign-in and HomeScreen to load
  
  console.log("Entering name 'TestHost'...");
  await page.fill('input[placeholder="e.g. Bill"]', 'TestHost');
  
  console.log("Clicking 'Create Private Table'...");
  await page.click('text=Create Private Table');
  await page.waitForTimeout(3000);
  
  console.log("Adding computer player...");
  await page.click('text=Add Computer Player');
  await page.waitForTimeout(1500);
  
  console.log("Starting game...");
  await page.click('text=Start Game');
  await page.waitForTimeout(4000);
  
  console.log("Clicking 'Chat'...");
  await page.click('text=Chat');
  await page.waitForTimeout(1500);
  
  console.log("Typing message...");
  await page.fill('input[placeholder="Type a message..."]', 'Hello, this is a test!');
  
  console.log("Clicking 'Send'...");
  await page.click('text=Send');
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  if (content.includes('Hello, this is a test!')) {
    console.log("SUCCESS: Message found in the DOM!");
  } else {
    console.log("FAILURE: Message NOT found in the DOM!");
    console.log("DOM CONTENT:", content);
  }
  
  await browser.close();
}

testChat().catch(console.error);
