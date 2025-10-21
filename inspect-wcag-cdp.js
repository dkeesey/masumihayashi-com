#!/usr/bin/env node

/**
 * Chrome DevTools Protocol Script
 * Inspects WCAG fixes on localhost:4322
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
    // Enable DOM domain
    await sendCommand('DOM.enable');
    await sendCommand('CSS.enable');

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get document
    const { root } = await sendCommand('DOM.getDocument');

    // Query footer sections
    const footerQuery = await sendCommand('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: 'footer'
    });

    if (!footerQuery.nodeId) {
      console.error('❌ Footer not found');
      process.exit(1);
    }

    // Get all direct div children of footer
    const { nodeIds } = await sendCommand('DOM.querySelectorAll', {
      nodeId: footerQuery.nodeId,
      selector: 'footer > div'
    });

    console.log('🔍 Inspecting Footer Sections:\n');

    for (let i = 0; i < nodeIds.length && i < 3; i++) {
      const nodeId = nodeIds[i];

      // Get computed styles
      const { computedStyle } = await sendCommand('CSS.getComputedStyleForNode', {
        nodeId
      });

      const bgColor = computedStyle.find(s => s.name === 'background-color');
      const sectionName = ['Navigation', 'Attribution', 'Copyright'][i];

      console.log(`Section ${i + 1} (${sectionName}):`);
      console.log(`  Background: ${bgColor.value}`);
    }

    // Check prose text color
    console.log('\n🔍 Inspecting Text Contrast:\n');

    const proseQuery = await sendCommand('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: '.prose p'
    });

    if (proseQuery.nodeId) {
      const { computedStyle } = await sendCommand('CSS.getComputedStyleForNode', {
        nodeId: proseQuery.nodeId
      });

      const textColor = computedStyle.find(s => s.name === 'color');
      console.log(`Prose text color: ${textColor.value}`);
      console.log('Expected: rgb(26, 26, 26) for WCAG AAA compliance');
    }

    console.log('\n✅ Inspection complete');
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
