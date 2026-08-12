const { chromium } = require('playwright');

async function runTest() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  
  // Create two separate browser contexts
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  pageA.on('console', msg => console.log(`[Host Console] ${msg.type()}: ${msg.text()}`));
  pageB.on('console', msg => console.log(`[Guest Console] ${msg.type()}: ${msg.text()}`));

  pageA.on('pageerror', err => console.log(`[Host Page Error] ${err.toString()}`));
  pageB.on('pageerror', err => console.log(`[Guest Page Error] ${err.toString()}`));

  try {
    console.log("Navigating...");
    await pageA.goto('http://localhost:8081');
    await pageB.goto('http://localhost:8081');
    await pageA.waitForTimeout(1000);
    await pageB.waitForTimeout(1000);

    // Guest login
    await pageA.click('text=Play as Guest');
    await pageB.click('text=Play as Guest');
    await pageA.waitForTimeout(2000);
    await pageB.waitForTimeout(2000);

    // Fill names
    await pageA.fill('input[placeholder="e.g. Bill"]', 'HostPlayer');
    await pageB.fill('input[placeholder="e.g. Bill"]', 'GuestPlayer');

    // Create room
    await pageA.click('text=Create Private Table');
    await pageA.waitForTimeout(2000);

    // Get code
    const roomCodeElement = await pageA.waitForSelector('text=Room Code:');
    const roomCodeText = await roomCodeElement.innerText();
    const roomCode = roomCodeText.replace('Room Code: ', '').trim();
    console.log(`Room Code: "${roomCode}"`);

    // Guest join
    await pageB.fill('input[placeholder*="Room Code"]', roomCode);
    await pageB.click('text=Join Table');
    await pageB.waitForTimeout(2000);

    // Host starts game
    await pageA.click('text=Start Game');
    await pageA.waitForTimeout(3000);

    // Check who has the turn
    const hostTurnText = await pageA.locator('text=/turn/i').innerText().catch(() => 'No Turn Text');
    const guestTurnText = await pageB.locator('text=/turn/i').innerText().catch(() => 'No Turn Text');
    console.log("Host Turn Text:", hostTurnText);
    console.log("Guest Turn Text:", guestTurnText);

    // Let's identify the active player
    const pageWithTurn = guestTurnText.toLowerCase().includes("your turn") ? pageB : pageA;
    const pageName = guestTurnText.toLowerCase().includes("your turn") ? "Guest" : "Host";
    const pageOther = guestTurnText.toLowerCase().includes("your turn") ? pageA : pageB;
    const pageOtherName = guestTurnText.toLowerCase().includes("your turn") ? "Host" : "Guest";
    console.log(`Active player is: ${pageName}`);

    // Wait a little bit for rendering
    await pageWithTurn.waitForTimeout(1000);

    // Click active card using browser evaluation
    console.log(`[${pageName}] Selecting and clicking active non-matching card in hand...`);
    const clickedResult = await pageWithTurn.evaluate(() => {
      // Find top discard rank
      let discardRank = "";
      const discardLabels = Array.from(document.querySelectorAll('*')).filter(el => {
        return el.textContent.trim() === 'DISCARD' && el.children.length === 0;
      });
      if (discardLabels.length > 0) {
        const cardEl = discardLabels[0].nextElementSibling;
        if (cardEl) {
          const text = cardEl.innerText || "";
          discardRank = text.split('\n')[0].trim();
        }
      }

      const divs = Array.from(document.querySelectorAll('div'));
      const activeCards = divs.filter(el => {
        const style = window.getComputedStyle(el);
        const hasWhiteBg = style.backgroundColor === 'rgb(255, 255, 255)';
        const isClickable = style.cursor === 'pointer';
        const inModal = el.closest('[role="dialog"]') || el.closest('.modal-content') || el.closest('[style*="display: none"]');
        return hasWhiteBg && isClickable && !inModal;
      });

      if (activeCards.length > 0) {
        let cardToClick = activeCards[0];
        // Look for a card that does NOT match the discard rank to avoid the immediate match rule
        for (const card of activeCards) {
          const cardText = (card.innerText || "").split('\n')[0].trim();
          if (cardText !== discardRank) {
            cardToClick = card;
            break;
          }
        }
        cardToClick.click();
        return { success: true, text: cardToClick.innerText, count: activeCards.length };
      }
      return { success: false, count: activeCards.length };
    });

    console.log("Click result:", clickedResult);
    await pageWithTurn.waitForTimeout(1000);

    // Now click the Discard button
    console.log(`[${pageName}] Clicking Discard button...`);
    await pageWithTurn.click('text=Discard (1)');
    await pageWithTurn.waitForTimeout(3000);

    // Take screenshot after discard
    await pageWithTurn.screenshot({ path: `after_discard.png` });
    console.log(`Screenshot saved: after_discard.png`);

    // Check if turn was automatically passed (match rule)
    const afterHostTurnText = await pageA.locator('text=/turn/i').innerText().catch(() => 'No Turn Text');
    const afterGuestTurnText = await pageB.locator('text=/turn/i').innerText().catch(() => 'No Turn Text');
    console.log("After Discard Host Turn Text:", afterHostTurnText);
    console.log("After Discard Guest Turn Text:", afterGuestTurnText);

    const activeAfterDiscard = afterGuestTurnText.toLowerCase().includes("your turn") ? "Guest" : "Host";
    if (activeAfterDiscard === pageOtherName) {
      console.log("SUCCESS: Matching card was discarded, turn was automatically passed to the next player (skipped picking phase)!");
    } else {
      // Not passed yet, must pick a card
      console.log(`[${pageName}] Clicking DECK pile to draw/pick card...`);
      const drawClickedResult = await pageWithTurn.evaluate(() => {
        const leafDeck = Array.from(document.querySelectorAll('*')).find(el => {
          return el.textContent.trim() === 'DECK' && el.children.length === 0;
        });
        if (leafDeck) {
          const button = leafDeck.nextElementSibling;
          if (button) {
            button.click();
            return { 
              success: true, 
              leafHTML: leafDeck.outerHTML,
              buttonHTML: button.outerHTML 
            };
          }
        }
        return { success: false };
      });
      console.log("Draw Click result:", drawClickedResult);

      await pageWithTurn.waitForTimeout(3000);

      // Verify turn is passed to the other player
      const finalHostTurnText = await pageA.locator('text=/turn/i').innerText().catch(() => 'No Turn Text');
      const finalGuestTurnText = await pageB.locator('text=/turn/i').innerText().catch(() => 'No Turn Text');
      console.log("Final Host Turn Text:", finalHostTurnText);
      console.log("Final Guest Turn Text:", finalGuestTurnText);

      const finalActivePlayerName = finalGuestTurnText.toLowerCase().includes("your turn") ? "Guest" : "Host";
      console.log(`Final active player is: ${finalActivePlayerName}`);

      if (finalActivePlayerName === pageOtherName) {
        console.log("SUCCESS: Turn was successfully passed to the next player!");
      } else {
        console.log("FAILURE: Turn was not passed to the next player.");
      }
    }

    // Take screenshot of completed turn
    await pageWithTurn.screenshot({ path: `completed_turn.png` });
    console.log(`Screenshot saved: completed_turn.png`);

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await browser.close();
    console.log("Closed.");
  }
}

runTest();
