import { chromium } from 'playwright';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001';

async function testRecipeAuthorGuideModal() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Xác thực Modal Sổ tay quy chuẩn ẩm thực...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    // 1. Đăng nhập Admin
    console.log('🔑 1. Đăng nhập Admin...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard?tab=recipes-create', {
      waitUntil: 'networkidle',
    });
    await page.fill('input[type="email"]', 'admin@culinaryblog.com');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => url.href.includes('/dashboard?tab=recipes-create'), {
      timeout: 15000,
    });
    console.log('✅ Đã đăng nhập vào trang Thêm công thức.');
    await page.waitForTimeout(2000);

    // 2. Tìm nút "Sổ tay hướng dẫn" trên Hero Banner
    console.log('🔍 2. Kiểm tra nút "Sổ tay hướng dẫn" trên Hero Banner...');
    const guideBtn = page.locator('button:has-text("Sổ tay hướng dẫn")');
    await guideBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Nút "Sổ tay hướng dẫn" hiển thị sắc nét trên Hero Banner!');

    // 3. Nhấp mở Modal
    console.log('🖱️ 3. Nhấp mở Modal Sổ tay hướng dẫn...');
    await guideBtn.click();
    await page.waitForTimeout(500);

    const modalTitle = page.locator('h3:has-text("Sổ tay quy chuẩn ẩm thực Culinary Blog")');
    await modalTitle.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Modal Sổ tay quy chuẩn ẩm thực đã mở thành công!');

    // 4. Chụp Tab 1: Quy chuẩn hình ảnh
    console.log('📸 4. Chụp Tab 1: Quy chuẩn hình ảnh...');
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/recipe_author_guide_modal_visual.png`,
      fullPage: false,
    });
    console.log('✅ Đã lưu recipe_author_guide_modal_visual.png');

    // 5. Chuyển sang Tab 2: Định lượng nguyên liệu
    console.log('📸 5. Chuyển sang Tab 2: Định lượng nguyên liệu...');
    await page.click('button:has-text("2. Định lượng nguyên liệu")');
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/recipe_author_guide_modal_ingredients.png`,
      fullPage: false,
    });
    console.log('✅ Đã lưu recipe_author_guide_modal_ingredients.png');

    // 6. Chuyển sang Tab 3: Quy trình & Hẹn giờ
    console.log('📸 6. Chuyển sang Tab 3: Quy trình & Hẹn giờ...');
    await page.click('button:has-text("3. Quy trình & Hẹn giờ")');
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/recipe_author_guide_modal_steps.png`,
      fullPage: false,
    });
    console.log('✅ Đã lưu recipe_author_guide_modal_steps.png');

    // 7. Chuyển sang Tab 4: Vòng đời xuất bản
    console.log('📸 7. Chuyển sang Tab 4: Vòng đời xuất bản...');
    await page.click('button:has-text("4. Vòng đời xuất bản")');
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/recipe_author_guide_modal_publishing.png`,
      fullPage: false,
    });
    console.log('✅ Đã lưu recipe_author_guide_modal_publishing.png');

    // 8. Đóng modal bằng nút "Đã hiểu & Bắt đầu viết"
    console.log('🖱️ 8. Kiểm tra nút đóng Modal "Đã hiểu & Bắt đầu viết"...');
    await page.click('button:has-text("Đã hiểu & Bắt đầu viết")');
    await page.waitForTimeout(500);
    const isModalVisible = await modalTitle.isVisible();
    if (!isModalVisible) {
      console.log('✅ Modal đã đóng mượt mà!');
    } else {
      throw new Error('Modal vẫn còn hiển thị sau khi nhấn nút đóng');
    }

    console.log('🎉 TOÀN BỘ KIỂM THỬ E2E MODAL SỔ TAY QUY CHUẨN ẨM THỰC ĐẠT 100% PASS!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử E2E:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testRecipeAuthorGuideModal();
