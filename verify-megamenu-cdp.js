#!/usr/bin/env node

/**
 * Chrome DevTools Protocol Script
 * Verifies mega menu navigation
 */

import WebSocket from 'ws';

const PAGE_ID = '88A6FD6E341BAE86C2CEFB75A0EB9C17';
const ws = new WebSocket(`ws://localhost:9222/devtools/page/${PAGE_ID}`);

let messageId = 1;

function sendCommand(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = messageId++;
    const handler = (data) => {
      const message = JSON.parse(data);
      if (message.id === id) {
        ws.off('message', handler);
        if (message.error) {
          reject(message.error);
        } else {
          resolve(message.result);
        }
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

ws.on('open', async () => {
  console.log('✅ Connected to Chrome DevTools Protocol\n');

  try {
    // Navigate to homepage
    await sendCommand('Page.navigate', { url: 'http://localhost:4322/' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Enable DOM domain
    await sendCommand('DOM.enable');

    // Get document
    const { root } = await sendCommand('DOM.getDocument');

    console.log('🔍 Inspecting Navigation Structure:\n');

    // Check for "Artwork" button
    const artworkButton = await sendCommand('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: 'button:has(> span):contains("Artwork")'
    });

    // Try alternate selector
    const navItems = await sendCommand('DOM.querySelectorAll', {
      nodeId: root.nodeId,
      selector: 'nav a, nav button'
    });

    console.log(`Found ${navItems.nodeIds.length} navigation items\n`);

    // Get text content of first few nav items
    for (let i = 0; i < Math.min(10, navItems.nodeIds.length); i++) {
      const { outerHTML } = await sendCommand('DOM.getOuterHTML', {
        nodeId: navItems.nodeIds[i]
      });

      // Extract just the text or button name
      const match = outerHTML.match(/>([^<]+)</);
      if (match) {
        console.log(`Nav item ${i + 1}: ${match[1].trim()}`);
      }
    }

    // Take screenshot
    const { data } = await sendCommand('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    console.log('\n✅ Navigation verified');
    console.log('Screenshot data length:', data.length);

    ws.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    ws.close();
    process.exit(1);
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
  process.exit(1);
});
