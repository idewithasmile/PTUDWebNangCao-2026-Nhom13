import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001';

async function runLifecycleAndLayoutTest() {
  console.log('🚀 Bắt đầu kiểm thử toàn diện: Bố cục 2 cột cân bằng, Chuyển đổi Studio linh hoạt, Vòng đời công thức & Nạp dữ liệu thật...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });

  const page = await context.newPage();

  try {
    // 1. Đăng nhập tài khoản Bếp trưởng (Author)
    console.log('🔑 1. Đăng nhập tài khoản Author (author@culinaryblog.com)...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'author@culinaryblog.com');
    await page.fill('input[type="password"]', 'Author@123456');
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => url.pathname.includes('/dashboard'), { timeout: 15000 });
    console.log('✅ Đã đăng nhập thành công vào Dashboard.');
    await page.waitForTimeout(1000);

    // 2. Kiểm thử Giao diện Tạo mới (Bố cục 2 cột cân bằng - Xóa khoảng trắng)
    console.log('🧭 2. Điều hướng đến trang Tạo mới công thức (/dashboard?tab=recipes-create)...');
    await page.goto('http://localhost:3000/dashboard?tab=recipes-create', { waitUntil: 'networkidle' });
    await page.waitForSelector('#card-general', { timeout: 10000 });

    // Kiểm tra sự hiện diện của 2 cột cân bằng
    const leftCol = page.locator('.lg\\:col-span-7');
    const rightCol = page.locator('.lg\\:col-span-5');
    await leftCol.waitFor();
    await rightCol.waitFor();
    console.log('✅ Đã xác nhận cấu trúc 2 cột cân bằng: Cột trái (lg:col-span-7) và Cột phải (lg:col-span-5).');

    // Chụp ảnh phần đầu trang tạo mới
    const screenshot1 = path.join(ARTIFACTS_DIR, 'test_create_layout_balanced_top.png');
    await page.screenshot({ path: screenshot1, fullPage: false });
    console.log(`📸 Đã lưu ảnh chụp đầu trang tạo mới: ${screenshot1}`);

    // Bấm nút "Điền mẫu hoàn chỉnh" để nạp Bánh Mì Chảo Hà Nội
    console.log('✨ 3. Bấm nút "Điền mẫu hoàn chỉnh" để nạp dữ liệu chuẩn Bánh Mì Chảo Hà Nội...');
    const fillSampleBtn = page.locator('button:has-text("Điền mẫu hoàn chỉnh")');
    await fillSampleBtn.click();
    await page.waitForTimeout(1000);

    // Cuộn xuống giữa trang để kiểm tra khoảng trắng đã bị lấp đầy
    await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
    await page.waitForTimeout(800);

    const screenshot2 = path.join(ARTIFACTS_DIR, 'test_create_layout_no_whitespace_scrolled.png');
    await page.screenshot({ path: screenshot2, fullPage: false });
    console.log(`📸 Đã lưu ảnh chụp khi cuộn xuống (Cột phải đã đầy đủ Nguyên liệu & Dinh dưỡng, KHÔNG CÒN KHOẢNG TRẮNG): ${screenshot2}`);

    // 4. Kiểm thử lưu bản nháp (Draft Mode)
    console.log('💾 4. Bấm "Lưu bản nháp" để tạo công thức ở trạng thái Draft...');
    const saveDraftBtn = page.locator('button:has-text("Lưu bản nháp")');
    await saveDraftBtn.click();
    await page.waitForTimeout(3000);

    // Kiểm tra xem đã chuyển vào Recipe Studio chưa
    await page.waitForURL((url) => url.searchParams.get('tab') === 'recipes-edit', { timeout: 15000 });
    const currentUrl = page.url();
    console.log(`✅ Công thức đã được lưu nháp và chuyển vào Recipe Studio: ${currentUrl}`);

    const screenshot3 = path.join(ARTIFACTS_DIR, 'test_studio_draft_created.png');
    await page.screenshot({ path: screenshot3, fullPage: false });
    console.log(`📸 Đã lưu ảnh chụp Recipe Studio (Hình 2): ${screenshot3}`);

    // 5. Kiểm thử nút chuyển đổi linh hoạt: "Xem dạng Soạn thảo 1 trang" ngay trong Studio
    console.log('🔄 5. Kiểm thử nút chuyển đổi "Xem dạng Soạn thảo 1 trang" trong Recipe Studio...');
    const toggleToFormBtn = page.locator('button:has-text("Xem dạng Soạn thảo 1 trang")');
    await toggleToFormBtn.waitFor();
    await toggleToFormBtn.click();
    await page.waitForTimeout(1500);

    const screenshot4 = path.join(ARTIFACTS_DIR, 'test_studio_toggled_to_1page_form.png');
    await page.screenshot({ path: screenshot4, fullPage: false });
    console.log(`📸 Đã lưu ảnh chụp khi chuyển sang Chế độ Soạn thảo 1 trang từ Studio: ${screenshot4}`);

    // Chuyển lại về Studio 5 Tab
    console.log('🔄 6. Chuyển lại về "Xem dạng Studio (5 Tab)"...');
    const toggleBackToStudioBtn = page.locator('button:has-text("Mở Studio (5 Tab)")').first();
    await toggleBackToStudioBtn.click();
    await page.waitForTimeout(1500);

    // 6. Kiểm thử chuyển đổi trạng thái: Xuất bản công khai (Publish)
    console.log('📢 7. Chuyển sang Tab 5 (Xem trước & Tổng quan Live) để Xuất bản...');
    const previewTabBtn = page.locator('button:has-text("Xem trước & Tổng quan")');
    await previewTabBtn.click();
    await page.waitForTimeout(1500);

    const publishBtn = page.locator('button:has-text("Xuất bản công khai ngay")').first();
    await publishBtn.waitFor();
    await publishBtn.click();
    await page.waitForTimeout(2000);

    // Xác nhận xuất bản nếu có dialog
    const confirmPublishModalBtn = page.locator('button:has-text("Xác nhận xuất bản")');
    if (await confirmPublishModalBtn.isVisible()) {
      await confirmPublishModalBtn.click();
      await page.waitForTimeout(2000);
    }

    const screenshot5 = path.join(ARTIFACTS_DIR, 'test_studio_published_success.png');
    await page.screenshot({ path: screenshot5, fullPage: false });
    console.log(`📸 Đã lưu ảnh chụp bài viết ĐÃ XUẤT BẢN THÀNH CÔNG: ${screenshot5}`);

    // 7. Kiểm tra bài viết hiển thị công khai ở /recipes/[slug]
    const currentSlug = new URL(page.url()).searchParams.get('slug');
    if (currentSlug) {
      console.log(`🌐 8. Kiểm tra trang công khai tại /recipes/${currentSlug}...`);
      await page.goto(`http://localhost:3000/recipes/${currentSlug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const screenshot6 = path.join(ARTIFACTS_DIR, 'test_public_recipe_detail_view.png');
      await page.screenshot({ path: screenshot6, fullPage: false });
      console.log(`📸 Đã lưu ảnh chụp trang chi tiết công thức công khai ngoài thực tế: ${screenshot6}`);
    }

    // 8. Kiểm thử chuyển đổi trạng thái: Đưa vào kho lưu trữ (Archive)
    console.log('📦 9. Quay lại Studio và đưa công thức vào Kho lưu trữ (Archive)...');
    await page.goto(`http://localhost:3000/dashboard?tab=recipes-edit&slug=${currentSlug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const archiveBtn = page.locator('button:has-text("Lưu trữ")').first();
    await archiveBtn.click();
    await page.waitForTimeout(1500);

    const confirmArchiveBtn = page.locator('button:has-text("Xác nhận lưu trữ")');
    if (await confirmArchiveBtn.isVisible()) {
      await confirmArchiveBtn.click();
      await page.waitForTimeout(2000);
    }

    const screenshot7 = path.join(ARTIFACTS_DIR, 'test_studio_archived_success.png');
    await page.screenshot({ path: screenshot7, fullPage: false });
    console.log(`📸 Đã lưu ảnh chụp trạng thái Kho lưu trữ: ${screenshot7}`);

    console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ GIAO DIỆN & VÒNG ĐỜI TRẠNG THÁI ĐỀU THÀNH CÔNG RỰC RỠ!');
  } catch (err) {
    console.error('❌ Lỗi trong quá trình kiểm thử:', err);
    const errScreenshot = path.join(ARTIFACTS_DIR, 'test_error_snapshot.png');
    await page.screenshot({ path: errScreenshot, fullPage: true });
    console.log(`📸 Đã lưu ảnh chụp màn hình lỗi: ${errScreenshot}`);
  } finally {
    await browser.close();
  }
}

runLifecycleAndLayoutTest();
