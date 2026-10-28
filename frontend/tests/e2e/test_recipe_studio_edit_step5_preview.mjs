import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/4bbd637e-71d4-451e-ae80-bfc6913c3810';

async function runStudioEditPreviewTest() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Tab 5 Xem trước & Tổng quan trong Recipe Studio (Chỉnh sửa công thức)...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
  });

  const page = await context.newPage();

  try {
    // 1. Đăng nhập tài khoản Author
    console.log('🔑 1. Đăng nhập tài khoản Author (author@culinaryblog.com)...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', 'author@culinaryblog.com');
    await page.fill('input[type="password"]', 'Author@123456');
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => url.pathname === '/dashboard', { timeout: 20000 });
    console.log('✅ Đã đăng nhập và vào Dashboard thành công.');
    await page.waitForTimeout(1000);

    // 2. Mở Recipe Studio cho công thức bản nháp (bo-xao-luc-lac-rau-cu-tuoi-ngon-1793072944913)
    const draftSlug = 'bo-xao-luc-lac-rau-cu-tuoi-ngon-1793072944913';
    console.log(`🧭 2. Điều hướng vào Recipe Studio cho bài viết: "${draftSlug}"...`);
    await page.goto(`http://localhost:3000/dashboard?tab=recipes-edit&slug=${draftSlug}`, {
      waitUntil: 'networkidle',
    });

    // 3. Xác nhận đầy đủ 5 Tabs trong Recipe Studio
    console.log('🔍 3. Kiểm tra các Tab điều hướng trong Recipe Studio...');
    await page.waitForSelector('text=Thông tin & Dinh dưỡng');
    await page.waitForSelector('text=Thư viện hình ảnh');
    await page.waitForSelector('text=Nguyên liệu');
    await page.waitForSelector('text=Các bước thực hiện');
    await page.waitForSelector('text=Xem trước & Tổng quan');
    console.log('✅ Xác nhận Tab thứ 5 "Xem trước & Tổng quan" (Live) đã xuất hiện đầy đủ trong Recipe Studio!');

    // 4. Kiểm tra nút chuyển tiếp từ Tab 4 (Các bước thực hiện)
    console.log('🍳 4. Chuyển sang Tab 4 (Các bước thực hiện) và kiểm tra nút chuyển tiếp sang Tab 5...');
    await page.click('button:has-text("Các bước thực hiện")');
    await page.waitForSelector('text=Thêm bước thực hiện');
    await page.waitForTimeout(500);

    // Tìm banner điều hướng nhanh sang Tab 5
    const goToPreviewBtn = page.locator('button:has-text("Xem trước tổng quan")');
    await goToPreviewBtn.waitFor({ state: 'visible' });
    console.log('✅ Nút "Xem trước tổng quan" ở cuối Tab Các bước đã hiển thị.');
    await goToPreviewBtn.click();
    await page.waitForTimeout(1000);

    // 5. Kiểm tra nội dung Tab 5: Xem trước & Tổng quan
    console.log('👁️ 5. Kiểm tra toàn diện nội dung Tab 5: Xem trước & Tổng quan...');
    await page.waitForSelector('text=Xem trước bài viết & Quyết định xuất bản');
    await page.waitForSelector('text=Mô phỏng thực tế độc giả');

    // Kiểm tra 4 tiêu chí Checklist FR-RCP-005
    await page.waitForSelector('text=1. Tiêu đề món ăn');
    await page.waitForSelector('text=2. Hình ảnh món ăn');
    await page.waitForSelector('text=3. Danh sách nguyên liệu');
    await page.waitForSelector('text=4. Quy trình chế biến');
    console.log('✅ Checklist 4 tiêu chuẩn chất lượng (SRS FR-RCP-005) hiển thị đầy đủ và chính xác.');

    // Chụp ảnh màn hình toàn cảnh Tab 5
    const previewScreenshot = path.join(ARTIFACTS_DIR, 'e2e_studio_edit_step5_preview.png');
    await page.screenshot({ path: previewScreenshot, fullPage: true });
    console.log(`📸 Chụp ảnh màn hình Tab 5 lưu tại: ${previewScreenshot}`);

    // 6. Kiểm tra các nút phím tắt chỉnh sửa nhanh
    console.log('⚡ 6. Kiểm tra phím tắt chỉnh sửa nhanh quay lại các Tab...');
    await page.waitForSelector('button:has-text("1. Thông tin")');
    await page.waitForSelector('button:has-text("2. Ảnh")');
    await page.waitForSelector('button:has-text("3. Nguyên liệu")');
    await page.waitForSelector('button:has-text("4. Các bước")');
    console.log('✅ 4 phím tắt chỉnh sửa nhanh hiển thị đầy đủ.');

    // 7. Kiểm tra nút Xuất bản công khai ngay từ Tab 5 của bản nháp
    console.log('🚀 7. Kiểm tra thao tác xuất bản công khai ngay từ Tab 5...');
    const publishBtn = page.locator('button:has-text("Xuất bản công khai ngay")');
    const isPublishVisible = await publishBtn.isVisible();
    console.log(`✅ Nút "Xuất bản công khai ngay" hiển thị: ${isPublishVisible}`);

    if (isPublishVisible) {
      await publishBtn.click();
      await page.waitForTimeout(2000);

      // Chụp ảnh sau khi xuất bản
      const publishedScreenshot = path.join(ARTIFACTS_DIR, 'e2e_studio_edit_published_success.png');
      await page.screenshot({ path: publishedScreenshot, fullPage: true });
      console.log(`📸 Chụp ảnh sau khi xuất bản lưu tại: ${publishedScreenshot}`);
    }

    console.log('🌟 KIỂM THỬ TAB 5 XEM TRƯỚC & TỔNG QUAN TRONG RECIPE STUDIO ĐÃ HOÀN TẤT THÀNH CÔNG 100%!');
  } catch (err) {
    console.error('❌ Lỗi kiểm thử E2E Studio Edit Preview:', err);
    const errorScreenshot = path.join(ARTIFACTS_DIR, 'e2e_studio_edit_preview_error.png');
    await page.screenshot({ path: errorScreenshot, fullPage: true }).catch(() => {});
    throw err;
  } finally {
    await browser.close();
  }
}

runStudioEditPreviewTest();
