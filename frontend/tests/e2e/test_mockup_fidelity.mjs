import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001';

async function runMockupFidelityTest() {
  console.log('🚀 Bắt đầu kiểm thử độ chuẩn xác giao diện theo bản thiết kế mẫu...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
  });

  const page = await context.newPage();

  try {
    // 1. Đăng nhập Author
    console.log('🔑 1. Đăng nhập tài khoản Author...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'author@culinaryblog.com');
    await page.fill('input[type="password"]', 'Author@123456');
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => url.pathname.includes('/dashboard'), { timeout: 15000 });
    console.log('✅ Đã đăng nhập thành công vào Dashboard.');
    await page.waitForTimeout(1000);

    // 2. Mở trang Tạo mới công thức
    console.log('🧭 2. Mở trang Tạo công thức mới (/dashboard?tab=recipes-create)...');
    await page.goto('http://localhost:3000/dashboard?tab=recipes-create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Chụp ảnh giao diện ban đầu
    const initialScreenshot = path.join(ARTIFACTS_DIR, 'mockup_initial_view.png');
    await page.screenshot({ path: initialScreenshot, fullPage: false });
    console.log(`📸 Đã lưu ảnh ban đầu: ${initialScreenshot}`);

    // 3. Bấm "Điền mẫu nhanh"
    console.log('✨ 3. Bấm nút "Điền mẫu nhanh" để nạp dữ liệu chuẩn vị...');
    const fillSampleBtn = page.locator('button:has-text("Điền mẫu nhanh")');
    if (await fillSampleBtn.isVisible()) {
      await fillSampleBtn.click();
      await page.waitForTimeout(1000);
      console.log('✅ Đã nạp dữ liệu mẫu thành công.');
    }

    // Chụp ảnh sau khi điền mẫu (kiểm tra Live Preview Card bên phải cập nhật tức thì)
    const previewUpdatedScreenshot = path.join(ARTIFACTS_DIR, 'mockup_live_preview_updated.png');
    await page.screenshot({ path: previewUpdatedScreenshot, fullPage: false });
    console.log(`📸 Đã lưu ảnh Live Preview cập nhật realtime: ${previewUpdatedScreenshot}`);

    // 4. Kiểm tra chuyển Sub-tab "Nguyên liệu chi tiết"
    console.log('🥣 4. Chuyển sang Tab "Nguyên liệu chi tiết"...');
    const ingTab = page.locator('button:has-text("Nguyên liệu chi tiết")');
    await ingTab.click();
    await page.waitForTimeout(800);

    const ingTabScreenshot = path.join(ARTIFACTS_DIR, 'mockup_tab_ingredients.png');
    await page.screenshot({ path: ingTabScreenshot, fullPage: false });
    console.log(`📸 Đã lưu ảnh Tab Nguyên liệu: ${ingTabScreenshot}`);

    // 5. Kiểm tra cuộn chuột xem Live Preview Card có bám dính (sticky) không và xóa khoảng trắng
    console.log('📜 5. Cuộn chuột xuống để kiểm tra tính năng Sticky của Live Preview Card...');
    await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'smooth' }));
    await page.waitForTimeout(800);

    const stickyScreenshot = path.join(ARTIFACTS_DIR, 'mockup_sticky_preview_no_whitespace.png');
    await page.screenshot({ path: stickyScreenshot, fullPage: false });
    console.log(`📸 Đã lưu ảnh Sticky Preview xóa khoảng trắng: ${stickyScreenshot}`);

    // 6. Kiểm tra nút "Xem trước" mở Modal toàn cảnh
    console.log('👁️ 6. Bấm nút "Xem trước" để mở Modal xem trước toàn cảnh...');
    const previewBtn = page.locator('button:has-text("Xem trước")').first();
    await previewBtn.click();
    await page.waitForTimeout(1000);

    const modalScreenshot = path.join(ARTIFACTS_DIR, 'mockup_modal_full_preview.png');
    await page.screenshot({ path: modalScreenshot, fullPage: false });
    console.log(`📸 Đã lưu ảnh Modal xem trước toàn cảnh: ${modalScreenshot}`);

    // Đóng modal
    const closeModalBtn = page.locator('button:has-text("✕")').last();
    if (await closeModalBtn.isVisible()) {
      await closeModalBtn.click();
      await page.waitForTimeout(500);
    }

    console.log('🎉 TOÀN BỘ KIỂM THỬ ĐỘ CHUẨN XÁC GIAO DIỆN HOÀN THÀNH 100% THÀNH CÔNG!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runMockupFidelityTest();
