#!/usr/bin/env node
/**
 * Audit Cloudinary folders by testing sample image URLs
 * Since we don't have API access to masumi-hayashi-foundation cloud,
 * we'll test folder existence by trying known image patterns
 */

const https = require('https');

const CLOUD_NAME = 'masumi-hayashi-foundation';

// Series folder names to test (based on NavMenu.tsx)
const seriesFolders = [
  'internment-camps',        // Known to exist
  'sacred-architectures',
  'post-industrial',
  'prisons',
  'war-military',
  'epa-superfund',
  'city-works',
  'commissions'
];

// Also test alternative naming patterns
const alternativeNames = {
  'internment-camps': ['japanese-american-internment-camps', 'ja-internment-camps'],
  'prisons': ['abandoned-prisons', 'prisons-institutions'],
  'war-military': ['war-and-military-sites', 'military'],
  'epa-superfund': ['epa-superfund-sites', 'superfund'],
  'commissions': ['public-commissions']
};

function testImageURL(folder, sampleSlug) {
  return new Promise((resolve) => {
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${folder}/${sampleSlug}.jpg`;

    https.get(url, (res) => {
      resolve({
        folder,
        exists: res.statusCode === 200,
        statusCode: res.statusCode,
        contentType: res.headers['content-type']
      });
    }).on('error', () => {
      resolve({ folder, exists: false, error: true });
    });
  });
}

async function auditFolders() {
  console.log('🔍 Auditing Cloudinary folder structure...\\n');
  console.log(`Cloud: ${CLOUD_NAME}\\n`);

  const results = {
    confirmed: [],
    notFound: [],
    alternatives: []
  };

  // Test primary folder names with generic slugs
  for (const folder of seriesFolders) {
    // Try multiple possible first images
    const testSlugs = [
      `${folder}-1`,
      `${folder.replace(/-/g, '-')}-monument`,
      'image-1',
      '001'
    ];

    let found = false;
    for (const slug of testSlugs) {
      const result = await testImageURL(folder, slug);
      if (result.exists) {
        console.log(`✅ ${folder}/ - EXISTS (tested: ${slug})`);
        results.confirmed.push(folder);
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(`❌ ${folder}/ - NOT FOUND (tried ${testSlugs.length} patterns)`);
      results.notFound.push(folder);

      // Try alternatives
      if (alternativeNames[folder]) {
        for (const altName of alternativeNames[folder]) {
          const altResult = await testImageURL(altName, `${altName}-1`);
          if (altResult.exists) {
            console.log(`   ↳ Found alternative: ${altName}/`);
            results.alternatives.push({ expected: folder, actual: altName });
            break;
          }
        }
      }
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`\\n✅ Confirmed folders (${results.confirmed.length}):`);
  results.confirmed.forEach(f => console.log(`   - ${f}/`));

  if (results.alternatives.length > 0) {
    console.log(`\\n🔄 Alternative names found (${results.alternatives.length}):`);
    results.alternatives.forEach(a => console.log(`   - ${a.expected}/ → ${a.actual}/`));
  }

  if (results.notFound.length > 0) {
    console.log(`\\n❌ Not found (${results.notFound.length}):`);
    results.notFound.forEach(f => console.log(`   - ${f}/`));
  }

  return results;
}

// Run audit
auditFolders().then((results) => {
  console.log('\\n✨ Audit complete!\\n');
  process.exit(0);
}).catch((err) => {
  console.error('Error during audit:', err);
  process.exit(1);
});
