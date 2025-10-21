#!/usr/bin/env node

/**
 * Universal WCAG 2.1 AA Compliance Audit Tool
 *
 * Features:
 * - Automated accessibility testing with axe-core
 * - Comprehensive contrast ratio analysis for ALL text elements
 * - Line height and spacing validation
 * - Multi-page crawling support
 * - JSON and Markdown report generation
 * - Screenshot capture for violations
 * - CI/CD integration with exit codes
 *
 * Usage:
 *   node wcag-audit.mjs                              # Audit all pages
 *   node wcag-audit.mjs --url http://localhost:3000  # Custom URL
 *   node wcag-audit.mjs --pages /,/about,/contact    # Specific pages
 *   node wcag-audit.mjs --staged                     # Only staged files
 *   node wcag-audit.mjs --json-only                  # JSON output only
 *   node wcag-audit.mjs --threshold 4.5              # Custom contrast threshold
 *   node wcag-audit.mjs --help                       # Show help
 */

import { chromium } from 'playwright';
import { injectAxe, checkA11y } from 'axe-playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===================== CONFIGURATION =====================

const DEFAULT_CONFIG = {
  baseUrl: process.env.WCAG_AUDIT_URL || 'http://localhost:4321',
  outputDir: 'test-results',
  screenshotDir: 'test-results/wcag-violations',
  contrastThreshold: {
    normal: 4.5,    // Normal text (< 18px or < 14px bold)
    large: 3.0      // Large text (>= 18px or >= 14px bold)
  },
  lineHeightMinimum: 1.5,  // WCAG 1.4.12
  viewport: { width: 1920, height: 1080 },
  crawlDelay: 500  // ms between page loads
};

// ===================== COLOR UTILITIES =====================

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1.r, color1.g, color1.b);
  const l2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbFromString(colorStr) {
  if (!colorStr) return { r: 0, g: 0, b: 0 };

  // Handle rgb() and rgba()
  if (colorStr.startsWith('rgb')) {
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }

  // Handle hex colors
  if (colorStr.startsWith('#')) {
    const hex = colorStr.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return { r, g, b };
  }

  // Handle named colors (basic support)
  const namedColors = {
    'white': { r: 255, g: 255, b: 255 },
    'black': { r: 0, g: 0, b: 0 },
    'transparent': { r: 0, g: 0, b: 0 }
  };

  return namedColors[colorStr.toLowerCase()] || { r: 0, g: 0, b: 0 };
}

// ===================== PAGE CRAWLING =====================

async function discoverPages(page, baseUrl, maxPages = 50) {
  console.log('🔍 Discovering pages...');

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Get all internal links
    const links = await page.evaluate((base) => {
      const baseURL = new URL(base);
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      const internalLinks = new Set();

      allLinks.forEach(link => {
        try {
          const href = link.getAttribute('href');
          const url = new URL(href, base);

          // Only include same-origin links
          if (url.origin === baseURL.origin) {
            // Remove hash and query params for uniqueness
            const cleanPath = url.pathname;
            internalLinks.add(cleanPath);
          }
        } catch (e) {
          // Skip invalid URLs
        }
      });

      return Array.from(internalLinks);
    }, baseUrl);

    const pages = ['/', ...links].slice(0, maxPages);
    console.log(`  ✓ Found ${pages.length} pages to audit`);
    return [...new Set(pages)]; // Remove duplicates
  } catch (error) {
    console.warn('  ⚠️  Could not crawl site, auditing homepage only');
    return ['/'];
  }
}

// ===================== CONTRAST ANALYSIS =====================

async function analyzeContrast(page, config) {
  return await page.evaluate((cfg) => {
    const elements = [];
    const violations = [];
    const warnings = [];

    // Get all text-containing elements
    const allText = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, li, span, div, button, label, td, th');

    allText.forEach((el) => {
      const text = el.textContent?.trim();
      if (!text || text.length === 0) return;

      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      const fontSize = styles.fontSize;
      const fontWeight = styles.fontWeight;
      const lineHeight = styles.lineHeight;
      const opacity = styles.opacity;

      // Get effective background color by traversing up the DOM
      let bgColor = backgroundColor;
      let parent = el.parentElement;
      while (bgColor === 'rgba(0, 0, 0, 0)' && parent) {
        bgColor = window.getComputedStyle(parent).backgroundColor;
        parent = parent.parentElement;
      }

      // If still transparent, assume white background
      if (bgColor === 'rgba(0, 0, 0, 0)') {
        bgColor = 'rgb(255, 255, 255)';
      }

      // Get element selector
      let selector = el.tagName.toLowerCase();
      if (el.id) {
        selector += `#${el.id}`;
      } else if (el.className && typeof el.className === 'string') {
        const classes = el.className.trim().split(/\s+/).slice(0, 3).join('.');
        if (classes) selector += `.${classes}`;
      }

      elements.push({
        selector,
        text: text.substring(0, 100),
        color,
        backgroundColor: bgColor,
        fontSize,
        fontWeight,
        lineHeight,
        opacity,
        isLargeText: parseFloat(fontSize) >= 18 ||
                     (parseFloat(fontSize) >= 14 && parseInt(fontWeight) >= 700)
      });
    });

    return { elements, totalElements: elements.length };
  }, config);
}

function calculateContrastViolations(elements, config) {
  const violations = [];
  const warnings = [];

  elements.forEach((el) => {
    try {
      const fgColor = rgbFromString(el.color);
      const bgColor = rgbFromString(el.backgroundColor);
      const ratio = getContrastRatio(fgColor, bgColor);

      const requiredRatio = el.isLargeText ? config.contrastThreshold.large : config.contrastThreshold.normal;
      const passes = ratio >= requiredRatio;

      if (!passes) {
        const violation = {
          selector: el.selector,
          text: el.text,
          foreground: el.color,
          background: el.backgroundColor,
          contrastRatio: ratio.toFixed(2),
          required: requiredRatio,
          gap: (requiredRatio - ratio).toFixed(2),
          fontSize: el.fontSize,
          fontWeight: el.fontWeight,
          lineHeight: el.lineHeight,
          opacity: el.opacity,
          isLargeText: el.isLargeText
        };

        // Serious violation if > 30% below threshold
        if (ratio < requiredRatio * 0.7) {
          violations.push(violation);
        } else {
          warnings.push(violation);
        }
      }
    } catch (err) {
      // Skip elements with invalid colors
    }
  });

  return { violations, warnings };
}

// ===================== LINE HEIGHT ANALYSIS =====================

async function analyzeLineHeight(page, config) {
  return await page.evaluate((cfg) => {
    const issues = [];
    const paragraphs = document.querySelectorAll('p, li');

    paragraphs.forEach(p => {
      const styles = window.getComputedStyle(p);
      const lineHeight = styles.lineHeight;
      const fontSize = parseFloat(styles.fontSize);

      let ratio;
      if (lineHeight === 'normal') {
        ratio = 1.2; // Browser default
      } else {
        const lhNum = parseFloat(lineHeight);
        ratio = lhNum / fontSize;
      }

      if (ratio < cfg.lineHeightMinimum) {
        let selector = p.tagName.toLowerCase();
        if (p.id) {
          selector += `#${p.id}`;
        } else if (p.className && typeof p.className === 'string') {
          const classes = p.className.trim().split(/\s+/).slice(0, 3).join('.');
          if (classes) selector += `.${classes}`;
        }

        issues.push({
          selector,
          text: p.textContent?.substring(0, 100),
          lineHeight,
          fontSize: styles.fontSize,
          ratio: ratio.toFixed(2),
          recommended: cfg.lineHeightMinimum,
          gap: (cfg.lineHeightMinimum - ratio).toFixed(2)
        });
      }
    });

    return issues;
  }, config);
}

// ===================== AXE-CORE INTEGRATION =====================

async function runAxeAudit(page) {
  try {
    await injectAxe(page);

    const results = await page.evaluate(async () => {
      // @ts-ignore
      const axe = window.axe;
      if (!axe) return null;

      return await axe.run({
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        }
      });
    });

    return results;
  } catch (error) {
    console.warn('  ⚠️  axe-core audit failed:', error.message);
    return null;
  }
}

// ===================== SCREENSHOT CAPTURE =====================

async function captureViolationScreenshots(page, violations, outputDir, pageUrl) {
  if (violations.length === 0) return [];

  const screenshots = [];
  const screenshotDir = path.join(outputDir, 'screenshots');

  // Create directory if needed
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Take up to 5 screenshots per page
  const maxScreenshots = Math.min(5, violations.length);

  for (let i = 0; i < maxScreenshots; i++) {
    const violation = violations[i];
    const filename = `${path.basename(pageUrl).replace(/[^a-z0-9]/gi, '-')}-violation-${i + 1}.png`;
    const filepath = path.join(screenshotDir, filename);

    try {
      // Try to find and screenshot the element
      const selector = violation.selector || violation.target?.[0];
      if (selector) {
        const element = await page.locator(selector).first();
        if (await element.count() > 0) {
          await element.screenshot({ path: filepath });
          screenshots.push({
            violation: violation.description || violation.text,
            screenshot: path.relative(outputDir, filepath)
          });
        }
      }
    } catch (error) {
      // Skip if element not found or screenshot fails
    }
  }

  return screenshots;
}

// ===================== AUDIT PAGE =====================

async function auditPage(page, url, config) {
  console.log(`\n📄 Auditing: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('  ✓ Page loaded');
  } catch (error) {
    console.error(`  ✗ Failed to load: ${error.message}`);
    return null;
  }

  // Run axe-core audit
  console.log('  🔍 Running axe-core audit...');
  const axeResults = await runAxeAudit(page);
  const axeViolations = axeResults?.violations || [];
  console.log(`    Found ${axeViolations.length} axe violations`);

  // Analyze contrast
  console.log('  🎨 Analyzing contrast ratios...');
  const { elements, totalElements } = await analyzeContrast(page, config);
  const { violations: contrastViolations, warnings: contrastWarnings } =
    calculateContrastViolations(elements, config);
  console.log(`    Checked ${totalElements} elements`);
  console.log(`    Found ${contrastViolations.length} serious violations, ${contrastWarnings.length} warnings`);

  // Analyze line height
  console.log('  📏 Analyzing line spacing...');
  const lineHeightIssues = await analyzeLineHeight(page, config);
  console.log(`    Found ${lineHeightIssues.length} line height issues`);

  // Capture screenshots
  const screenshots = await captureViolationScreenshots(
    page,
    [...axeViolations, ...contrastViolations].slice(0, 5),
    config.outputDir,
    url
  );

  return {
    url,
    timestamp: new Date().toISOString(),
    summary: {
      totalElements,
      axeViolations: axeViolations.length,
      contrastViolations: contrastViolations.length,
      contrastWarnings: contrastWarnings.length,
      lineHeightIssues: lineHeightIssues.length,
      totalViolations: axeViolations.length + contrastViolations.length
    },
    axe: {
      violations: axeViolations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        targets: v.nodes.map(n => n.target).flat()
      }))
    },
    contrast: {
      violations: contrastViolations.slice(0, 20),
      warnings: contrastWarnings.slice(0, 20)
    },
    lineHeight: lineHeightIssues.slice(0, 10),
    screenshots
  };
}

// ===================== REPORT GENERATION =====================

function generateJsonReport(results, outputDir) {
  const reportPath = path.join(outputDir, 'wcag-violations.json');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      pagesScanned: results.length,
      totalViolations: results.reduce((sum, r) => sum + (r?.summary.totalViolations || 0), 0),
      passed: results.every(r => r?.summary.totalViolations === 0)
    },
    pages: results
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n✓ JSON report saved: ${reportPath}`);

  return report;
}

function generateMarkdownReport(results, config, outputDir) {
  const reportPath = path.join(outputDir, 'WCAG-REPORT.md');

  let markdown = '# WCAG 2.1 AA Compliance Audit Report\n\n';
  markdown += `**Date**: ${new Date().toLocaleDateString()}\n`;
  markdown += `**Time**: ${new Date().toLocaleTimeString()}\n\n`;

  // Summary
  markdown += '## Summary\n\n';
  const totalViolations = results.reduce((sum, r) => sum + (r?.summary.totalViolations || 0), 0);
  const totalPages = results.filter(r => r !== null).length;
  const passed = totalViolations === 0;

  markdown += `- **Status**: ${passed ? '✅ PASSED' : '❌ FAILED'}\n`;
  markdown += `- **Pages Scanned**: ${totalPages}\n`;
  markdown += `- **Total Violations**: ${totalViolations}\n\n`;

  if (passed) {
    markdown += '🎉 **All pages meet WCAG 2.1 AA standards!**\n\n';
  } else {
    markdown += '⚠️ **Accessibility violations found. Details below.**\n\n';
  }

  // Per-page results
  markdown += '## Page Results\n\n';

  results.forEach(result => {
    if (!result) return;

    const pageStatus = result.summary.totalViolations === 0 ? '✅' : '❌';
    markdown += `### ${pageStatus} ${result.url}\n\n`;

    if (result.summary.totalViolations === 0) {
      markdown += '✅ No violations found.\n\n';
      return;
    }

    // Axe violations
    if (result.axe.violations.length > 0) {
      markdown += `#### Automated Accessibility Issues (${result.axe.violations.length})\n\n`;

      result.axe.violations.slice(0, 10).forEach((v, i) => {
        markdown += `${i + 1}. **${v.description}**\n`;
        markdown += `   - **Impact**: ${v.impact}\n`;
        markdown += `   - **Affected elements**: ${v.nodes}\n`;
        markdown += `   - **Help**: ${v.help}\n`;
        markdown += `   - **Learn more**: ${v.helpUrl}\n\n`;
      });
    }

    // Contrast violations
    if (result.contrast.violations.length > 0) {
      markdown += `#### Color Contrast Violations (${result.contrast.violations.length})\n\n`;
      markdown += 'WCAG requires:\n';
      markdown += '- **4.5:1** for normal text\n';
      markdown += '- **3.0:1** for large text (18px+ or 14px+ bold)\n\n';

      result.contrast.violations.slice(0, 10).forEach((v, i) => {
        markdown += `${i + 1}. **${v.selector}**\n`;
        markdown += `   - Text: "${v.text.substring(0, 60)}..."\n`;
        markdown += `   - Contrast: ${v.contrastRatio}:1 (required: ${v.required}:1)\n`;
        markdown += `   - Gap: ${v.gap} ratio points below requirement\n`;
        markdown += `   - Foreground: ${v.foreground}\n`;
        markdown += `   - Background: ${v.background}\n`;
        markdown += `   - Font size: ${v.fontSize}${v.isLargeText ? ' (large text)' : ''}\n\n`;
      });
    }

    // Line height issues
    if (result.lineHeight.length > 0) {
      markdown += `#### Line Height Issues (${result.lineHeight.length})\n\n`;
      markdown += `Recommended minimum: **${config.lineHeightMinimum}**\n\n`;

      result.lineHeight.slice(0, 5).forEach((issue, i) => {
        markdown += `${i + 1}. **${issue.selector}**\n`;
        markdown += `   - Current ratio: ${issue.ratio}\n`;
        markdown += `   - Gap: ${issue.gap} below recommendation\n`;
        markdown += `   - Font size: ${issue.fontSize}\n\n`;
      });
    }

    // Screenshots
    if (result.screenshots && result.screenshots.length > 0) {
      markdown += '#### Screenshots\n\n';
      result.screenshots.forEach((shot, i) => {
        markdown += `${i + 1}. [${shot.violation}](${shot.screenshot})\n`;
      });
      markdown += '\n';
    }
  });

  // Recommendations
  markdown += '## Recommendations\n\n';
  markdown += '### Color Contrast\n\n';
  markdown += '- Use dark text on light backgrounds or vice versa\n';
  markdown += '- Avoid gray text on gray backgrounds\n';
  markdown += '- Test contrast ratios before deploying: https://webaim.org/resources/contrastchecker/\n';
  markdown += '- Use theme color tokens that are pre-validated for WCAG compliance\n\n';

  markdown += '### Line Height\n\n';
  markdown += '- Set `line-height: 1.6` or higher for body text\n';
  markdown += '- Use `line-height: 1.5` minimum per WCAG 1.4.12\n';
  markdown += '- Increase for better readability on long-form content\n\n';

  markdown += '### Testing Tools\n\n';
  markdown += '- **axe DevTools**: Browser extension for manual testing\n';
  markdown += '- **WAVE**: Web accessibility evaluation tool\n';
  markdown += '- **Lighthouse**: Built into Chrome DevTools\n';
  markdown += '- **This script**: Run regularly in CI/CD pipeline\n\n';

  fs.writeFileSync(reportPath, markdown);
  console.log(`✓ Markdown report saved: ${reportPath}`);
}

// ===================== CLI ARGUMENT PARSING =====================

function parseArgs() {
  const args = process.argv.slice(2);

  const config = { ...DEFAULT_CONFIG };
  let pages = null;
  let jsonOnly = false;
  let staged = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      console.log(`
Universal WCAG 2.1 AA Compliance Audit Tool

Usage:
  node wcag-audit.mjs [options]

Options:
  --url <url>              Base URL to audit (default: http://localhost:4321)
  --pages <paths>          Comma-separated page paths (e.g., /,/about,/contact)
  --staged                 Only audit pages with staged changes
  --json-only              Output JSON only (no markdown)
  --threshold <number>     Custom contrast threshold (default: 4.5)
  --output <dir>           Output directory (default: test-results)
  --help, -h               Show this help message

Environment Variables:
  WCAG_AUDIT_URL           Default base URL

Examples:
  node wcag-audit.mjs
  node wcag-audit.mjs --url http://localhost:3000
  node wcag-audit.mjs --pages /,/about,/contact
  node wcag-audit.mjs --staged --json-only
  node wcag-audit.mjs --threshold 7.0  # Higher standard
      `);
      process.exit(0);
    } else if (arg === '--url' && i + 1 < args.length) {
      config.baseUrl = args[++i];
    } else if (arg === '--pages' && i + 1 < args.length) {
      pages = args[++i].split(',').map(p => p.trim());
    } else if (arg === '--staged') {
      staged = true;
    } else if (arg === '--json-only') {
      jsonOnly = true;
    } else if (arg === '--threshold' && i + 1 < args.length) {
      const threshold = parseFloat(args[++i]);
      config.contrastThreshold.normal = threshold;
    } else if (arg === '--output' && i + 1 < args.length) {
      config.outputDir = args[++i];
    }
  }

  return { config, pages, jsonOnly, staged };
}

// ===================== STAGED FILES DETECTION =====================

function getStagedPages() {
  try {
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
    const files = staged.split('\n').filter(f => f.match(/\.(astro|tsx|jsx|html)$/));

    // Convert file paths to page URLs (basic heuristic)
    const pages = files
      .filter(f => f.includes('pages/') || f.includes('src/'))
      .map(f => {
        const match = f.match(/pages\/(.+)\.(astro|tsx|jsx|html)$/);
        if (match) {
          const page = match[1] === 'index' ? '/' : `/${match[1]}`;
          return page;
        }
        return null;
      })
      .filter(Boolean);

    return pages.length > 0 ? pages : ['/'];
  } catch (error) {
    console.warn('⚠️  Could not detect staged files, auditing all pages');
    return null;
  }
}

// ===================== MAIN =====================

async function main() {
  console.log('🔍 WCAG 2.1 AA Compliance Audit\n');

  const { config, pages: cliPages, jsonOnly, staged } = parseArgs();

  // Create output directory
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  // Launch browser
  console.log('🚀 Starting browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: config.viewport });
  const page = await context.newPage();

  let pagesToAudit;

  try {
    // Determine which pages to audit
    if (staged) {
      pagesToAudit = getStagedPages();
      console.log(`📝 Auditing ${pagesToAudit.length} staged pages`);
    } else if (cliPages) {
      pagesToAudit = cliPages;
      console.log(`📝 Auditing ${pagesToAudit.length} specified pages`);
    } else {
      pagesToAudit = await discoverPages(page, config.baseUrl);
    }

    // Audit each page
    const results = [];

    for (let i = 0; i < pagesToAudit.length; i++) {
      const pagePath = pagesToAudit[i];
      const url = new URL(pagePath, config.baseUrl).href;

      const result = await auditPage(page, url, config);
      results.push(result);

      // Delay between pages
      if (i < pagesToAudit.length - 1) {
        await new Promise(resolve => setTimeout(resolve, config.crawlDelay));
      }
    }

    // Generate reports
    console.log('\n📊 Generating reports...');

    const report = generateJsonReport(results, config.outputDir);

    if (!jsonOnly) {
      generateMarkdownReport(results, config, config.outputDir);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('AUDIT COMPLETE');
    console.log('='.repeat(60));
    console.log(`Pages scanned: ${report.summary.pagesScanned}`);
    console.log(`Total violations: ${report.summary.totalViolations}`);
    console.log(`Status: ${report.summary.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('='.repeat(60) + '\n');

    // Exit code for CI/CD
    await browser.close();
    process.exit(report.summary.passed ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Audit failed:', error.message);
    await browser.close();
    process.exit(2);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(2);
});
