import { chromium } from 'playwright';
import path from 'path';

async function testEditPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

  console.log('1. Đăng nhập...');
  await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'author@culinaryblog.com');
  await page.fill('input[type="password"]', 'Author@123456');
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => u.pathname.includes('/dashboard'));

  console.log('2. Mở trang chỉnh sửa...');
  await page.goto('http://localhost:3000/dashboard?tab=recipes-mine', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Tìm link sửa hoặc đi thẳng vào slug
  const editLink = page.locator('button:has-text("Chỉnh sửa"), a[href*="recipes-edit"]').first();
  if (await editLink.isVisible()) {
    await editLink.click();
    await page.waitForTimeout(1500);
  } else {
    await page.goto('http://localhost:3000/dashboard?tab=recipes-edit&slug=banh-mi-chao-xiu-mai-sot-ca-chua-ha-noi', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
  }

  const outPath = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001/test_edit_page_unified_layout.png';
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('✅ Đã lưu ảnh trang Chỉnh sửa đồng nhất:', outPath);

  await browser.close();
}

testEditPage();
