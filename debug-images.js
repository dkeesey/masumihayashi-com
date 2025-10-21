const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to staging
  await page.goto('https://masumihayashi-com.pages.dev/family-album/akiya/');

  // Wait for images
  await page.waitForTimeout(3000);

  // Check if images exist in DOM
  const images = await page.$$('img[src*="butcam"]');
  console.log(`Found ${images.length} butcam images in DOM`);

  // Check each image
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = await img.getAttribute('src');
    const visible = await img.isVisible();
    const box = await img.boundingBox();
    const naturalWidth = await img.evaluate(el => el.naturalWidth);
    const naturalHeight = await img.evaluate(el => el.naturalHeight);
    const complete = await img.evaluate(el => el.complete);

    console.log(`\nImage ${i + 1}:`);
    console.log(`  src: ${src}`);
    console.log(`  visible: ${visible}`);
    console.log(`  bounding box: ${JSON.stringify(box)}`);
    console.log(`  natural dimensions: ${naturalWidth}x${naturalHeight}`);
    console.log(`  complete: ${complete}`);
  }

  await browser.close();
})();
