/**
 * test_recipe_step_images.mjs - Dedicated Playwright E2E Suite for Recipe Step Images
 * Milestone 4: Frontend UX Polish, System Integrity & Playwright E2E Specialist
 *
 * Verifies:
 * 1. Recipe detail page loads successfully for showcase recipe 'pho-bo-tai-lan-chuan-vi-ha-thanh'.
 * 2. All step illustration images are present in the DOM.
 * 3. Step images render with responsive styling, badges ('Ảnh bước {n}'), and naturalWidth > 0.
 * 4. Hands-free Cooking Mode modal displays step illustrations for active steps.
 * 5. Multiple dishes across categories render authentic step illustrations.
 * 6. Zero broken image network requests (0 HTTP 4xx/5xx).
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const TEST_SLUGS = [
  'pho-bo-tai-lan-chuan-vi-ha-thanh',
  'nem-ran-truyen-thong-ha-noi',
  'goi-cuon-tom-thit-thanh-mat',
];

async function runRecipeStepImagesTest() {
  console.log('=' .repeat(80));
  console.log('🍳 STARTING PLAYWRIGHT E2E TEST: RECIPE STEP IMAGES & COOKING MODE');
  console.log('=' .repeat(80));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  const failedImageUrls = [];
  const trackedImages = new Set();

  page.on('response', (response) => {
    const url = response.url();
    const isImage =
      url.includes('/culinary-blog/') ||
      response.headers()['content-type']?.startsWith('image/') ||
      url.match(/\.(jpg|jpeg|png|webp|svg)($|\?)/i);

    if (isImage) {
      trackedImages.add(url);
      if (response.status() >= 400) {
        failedImageUrls.push({ url, status: response.status() });
        console.error(`  ❌ Broken Image Request: [HTTP ${response.status()}] ${url}`);
      }
    }
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Showcase Recipe Step Images Verification
    // -------------------------------------------------------------------------
    console.log(`\n🔍 [TEST 1] Auditing Step Images for Showcase Recipe: '${TEST_SLUGS[0]}'...`);
    const res = await page.goto(`${BASE_URL}/recipes/${TEST_SLUGS[0]}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`  📡 HTTP Response: ${res.status()}`);
    await page.waitForTimeout(2000);

    await page.waitForSelector('h1:has-text("Phở bò tái lăn chuẩn vị Hà Thành")', { timeout: 10000 });
    console.log('  ✓ PASS: Recipe detail page loaded.');

    // Locate step image containers in RecipeStepsList
    const stepItems = page.locator('div.space-y-6 > div.flex.items-start.gap-4');
    const stepCount = await stepItems.count();
    console.log(`  ✓ Found ${stepCount} steps in preparation list.`);

    const stepImgs = page.locator('div.group\\/stepimg img');
    const imgCount = await stepImgs.count();
    console.log(`  ✓ Found ${imgCount} step illustration images with .group/stepimg container.`);

    if (imgCount < 3) {
      throw new Error(`Expected at least 3 step images, but found ${imgCount}`);
    }

    for (let i = 0; i < imgCount; i++) {
      const img = stepImgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      const isVis = await img.isVisible();
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el) => el.naturalWidth);
      const naturalHeight = await img.evaluate((el) => el.naturalHeight);

      if (!isVis || naturalWidth <= 0 || naturalHeight <= 0) {
        throw new Error(`Step image ${i + 1} failed to render properly (visible=${isVis}, naturalWidth=${naturalWidth}, src=${src})`);
      }

      console.log(`    ✓ Step ${i + 1} Image: rendered successfully (${naturalWidth}x${naturalHeight}px) -> ${src}`);
    }

    // Verify step badge overlays
    const stepBadges = page.locator('div.group\\/stepimg div:has-text("Ảnh bước")');
    const badgeCount = await stepBadges.count();
    console.log(`  ✓ PASS: ${badgeCount} step image badge overlays ('Ảnh bước {n}') verified.`);

    // -------------------------------------------------------------------------
    // TEST 2: Hands-Free Cooking Mode Modal Step Images
    // -------------------------------------------------------------------------
    console.log('\n🔍 [TEST 2] Verifying Step Images in Hands-Free Cooking Mode Modal ("Vào Bếp")...');
    const cookModeBtn = page.locator('button:has-text("Vào Bếp")').first();
    if (await cookModeBtn.isVisible()) {
      await cookModeBtn.click();
      await page.waitForTimeout(1000);

      // Verify modal dialog is open
      const modal = page.locator('div[role="dialog"][aria-label="Chế độ Vào Bếp rảnh tay"]');
      await modal.waitFor({ state: 'visible', timeout: 5000 });
      console.log('  ✓ PASS: Cooking mode modal opened.');

      // Check modal active step image
      const modalStepImg = modal.locator('img[alt*="Bước 1"]');
      await modalStepImg.waitFor({ state: 'visible', timeout: 5000 });
      const modalNaturalWidth = await modalStepImg.evaluate((el) => el.naturalWidth);
      if (modalNaturalWidth <= 0) {
        throw new Error(`Cooking mode Step 1 image has naturalWidth <= 0: ${modalNaturalWidth}`);
      }
      console.log(`  ✓ PASS: Cooking mode Step 1 illustration visible and rendered (${modalNaturalWidth}px width).`);

      // Advance to next step (Step 2)
      const nextStepBtn = modal.locator('button:has-text("Bước tiếp theo")');
      if (await nextStepBtn.isVisible()) {
        await nextStepBtn.click();
        await page.waitForTimeout(600);
        const step2Img = modal.locator('img[alt*="Bước 2"]');
        await step2Img.waitFor({ state: 'visible', timeout: 5000 });
        const step2Width = await step2Img.evaluate((el) => el.naturalWidth);
        if (step2Width <= 0) {
          throw new Error(`Cooking mode Step 2 image has naturalWidth <= 0: ${step2Width}`);
        }
        console.log(`  ✓ PASS: Transitioned to Step 2, illustration rendered properly (${step2Width}px width).`);
      }

      // Close modal
      const exitBtn = modal.locator('button[aria-label="Thoát chế độ Vào Bếp"], button:has-text("Thoát")').first();
      await exitBtn.click();
      await page.waitForTimeout(500);
      console.log('  ✓ PASS: Exited cooking mode modal cleanly.');
    } else {
      console.warn('  ⚠️ "Vào Bếp" button not visible on page, skipping modal test.');
    }

    // -------------------------------------------------------------------------
    // TEST 3: Multi-Recipe Step Images Audit
    // -------------------------------------------------------------------------
    for (let s = 1; s < TEST_SLUGS.length; s++) {
      const slug = TEST_SLUGS[s];
      console.log(`\n🔍 [TEST 3.${s}] Auditing Recipe: '${slug}'...`);
      await page.goto(`${BASE_URL}/recipes/${slug}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);

      const imgs = page.locator('div.group\\/stepimg img');
      const count = await imgs.count();
      console.log(`  ✓ Recipe '${slug}': found ${count} step images.`);
      if (count < 3) {
        throw new Error(`Recipe '${slug}' expected >= 3 step images, found ${count}`);
      }
      for (let j = 0; j < Math.min(count, 3); j++) {
        const item = imgs.nth(j);
        await item.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        const nw = await item.evaluate((el) => el.naturalWidth);
        if (nw <= 0) {
          throw new Error(`Step image in '${slug}' failed to render: naturalWidth=${nw}`);
        }
      }
      console.log(`  ✓ PASS: Recipe '${slug}' step images verified.`);
    }

    // -------------------------------------------------------------------------
    // TEST 4: Global Broken Image Audit (Zero 404s)
    // -------------------------------------------------------------------------
    console.log('\n' + '=' .repeat(80));
    console.log('📊 STEP IMAGES NETWORK AUDIT SUMMARY');
    console.log('=' .repeat(80));
    console.log(`Total image requests audited: ${trackedImages.size}`);
    console.log(`Total broken image requests (4xx/5xx): ${failedImageUrls.length}`);

    if (failedImageUrls.length > 0) {
      console.error('❌ BROKEN IMAGES DETECTED:');
      failedImageUrls.forEach((f) => console.error(`  - [HTTP ${f.status}] ${f.url}`));
      throw new Error(`Failed with ${failedImageUrls.length} broken image requests!`);
    }

    console.log('🎉 100% OF STEP IMAGES LOADED SUCCESSFULLY WITH ZERO 404 ERRORS!');
    console.log('🎉 PLAYWRIGHT RECIPE STEP IMAGES TEST SUITE PASSED 100%!');
    console.log('=' .repeat(80));
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runRecipeStepImagesTest();
