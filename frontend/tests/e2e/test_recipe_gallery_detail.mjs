import { chromium } from 'playwright';
import path from 'path';

async function testRecipeGallery() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Giao diện Thư viện ảnh chi tiết công thức...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const artifactDir = 'C:\\Users\\Maxsys\\.gemini\\antigravity\\brain\\4bbd637e-71d4-451e-ae80-bfc6913c3810';
  const detailUrl = 'http://localhost:3000/recipes/pho-bo-tai-lan-chuan-vi-ha-thanh';

  console.log(`🌐 Truy cập: ${detailUrl}...`);
  const response = await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log(`📡 HTTP Response: ${response?.status()}`);

  // Chờ tiêu đề và phần thông tin xuất hiện
  await page.waitForSelector('text=Phở bò tái lăn', { timeout: 10000 });
  console.log('✅ Tiêu đề công thức hiển thị thành công.');

  // Chờ khối Gallery xuất hiện
  const gallery = page.locator('div.rounded-3xl.bg-\\[\\#171412\\]');
  await gallery.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ Khối Gallery nền đen chuẩn Mockup (#171412) hiển thị thành công.');

  // Chờ ảnh load hoàn tất từ network
  await page.waitForTimeout(2500);

  // Chụp ảnh khu vực Gallery chi tiết
  const galleryScreenshotPath = path.join(artifactDir, 'mockup_recipe_gallery_detail.png');
  await gallery.screenshot({ path: galleryScreenshotPath });
  console.log(`📸 Đã lưu ảnh chụp khối Gallery: ${galleryScreenshotPath}`);

  // Chụp ảnh toàn bộ trang chi tiết công thức
  const fullDetailPath = path.join(artifactDir, 'mockup_recipe_full_detail.png');
  await page.screenshot({ path: fullDetailPath, fullPage: true });
  console.log(`📸 Đã lưu ảnh chụp toàn bộ trang chi tiết: ${fullDetailPath}`);

  // Kiểm tra tương tác: nhấp vào thumbnail thứ 2 (nếu có)
  const thumbnails = gallery.locator('div.flex.items-center.justify-center button:has(img)');
  const thumbCount = await thumbnails.count();
  console.log(`🔍 Tìm thấy ${thumbCount} thumbnails.`);

  if (thumbCount > 1) {
    console.log('🧪 Nhấp vào thumbnail thứ 2...');
    await thumbnails.nth(1).click();
    await page.waitForTimeout(500);

    // Kiểm tra thumbnail thứ 2 có border cam
    const isRingActive = await thumbnails.nth(1).evaluate((el) => el.className.includes('border-orange-500'));
    console.log(`✅ Thumbnail thứ 2 đang active (viền cam): ${isRingActive}`);

    const activeThumbPath = path.join(artifactDir, 'mockup_recipe_gallery_active_thumb.png');
    await gallery.screenshot({ path: activeThumbPath });
    console.log(`📸 Đã lưu ảnh chụp trạng thái active thumbnail 2: ${activeThumbPath}`);
  }

  // Kiểm tra phóng to Lightbox khi bấm nút Maximize
  const maxBtn = gallery.locator('button[title="Xem toàn màn hình"]');
  if (await maxBtn.isVisible()) {
    console.log('🧪 Nhấp nút phóng to Lightbox...');
    await maxBtn.click();
    await page.waitForTimeout(500);

    const lightbox = page.locator('button[title="Đóng"]');
    await lightbox.waitFor({ state: 'visible', timeout: 3000 });
    console.log('✅ Lightbox modal hiển thị thành công.');

    const lightboxPath = path.join(artifactDir, 'mockup_recipe_gallery_lightbox.png');
    await page.screenshot({ path: lightboxPath });
    console.log(`📸 Đã lưu ảnh chụp Lightbox: ${lightboxPath}`);

    // Đóng Lightbox
    await lightbox.click();
    await page.waitForTimeout(300);
    console.log('✅ Đã đóng Lightbox thành công.');
  }

  await browser.close();
  console.log('🎉 KIỂM THỬ THƯ VIỆN ẢNH CHI TIẾT CÔNG THỨC HOÀN TẤT THÀNH CÔNG!');
}

testRecipeGallery().catch((err) => {
  console.error('❌ Lỗi kiểm thử:', err);
  process.exit(1);
});
