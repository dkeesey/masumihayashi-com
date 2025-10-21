#!/usr/bin/env node

/**
 * Chrome DevTools Protocol Script
 * Inspects interactive element colors
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

    // Get document
    const { root } = await sendCommand('DOM.getDocument');

    console.log('🔍 Inspecting Interactive Elements:\n');

    // Check prose link color
    const linkQuery = await sendCommand('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: '.prose a'
    });

    if (linkQuery.nodeId) {
      const { computedStyle } = await sendCommand('CSS.getComputedStyleForNode', {
        nodeId: linkQuery.nodeId
      });

      const linkColor = computedStyle.find(s => s.name === 'color');
      console.log('Prose Link:');
      console.log(`  Color: ${linkColor.value}`);
      console.log(`  Expected: rgb(0, 102, 204) for WCAG AA compliance\n`);
    }

    // Check footer newsletter button
    const buttonQuery = await sendCommand('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: 'footer button[type="submit"]'
    });

    if (buttonQuery.nodeId) {
      const { computedStyle } = await sendCommand('CSS.getComputedStyleForNode', {
        nodeId: buttonQuery.nodeId
      });

      const bgColor = computedStyle.find(s => s.name === 'background-color');
      const textColor = computedStyle.find(s => s.name === 'color');

      console.log('Newsletter Button:');
      console.log(`  Background: ${bgColor.value}`);
      console.log(`  Text Color: ${textColor.value}`);
      console.log(`  Expected: rgb(0, 102, 204) background with white text\n`);
    }

    // Check footer link color
    const footerLinkQuery = await sendCommand('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: 'footer a'
    });

    if (footerLinkQuery.nodeId) {
      const { computedStyle } = await sendCommand('CSS.getComputedStyleForNode', {
        nodeId: footerLinkQuery.nodeId
      });

      const linkColor = computedStyle.find(s => s.name === 'color');
      console.log('Footer Link:');
      console.log(`  Color: ${linkColor.value}`);
      console.log(`  Expected: Blue links on dark background\n`);
    }

    console.log('✅ Inspection complete');
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
