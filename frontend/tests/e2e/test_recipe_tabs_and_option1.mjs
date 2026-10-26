import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/4bbd637e-71d4-451e-ae80-bfc6913c3810';

async function runTest() {
  console.log('🚀 Bắt đầu kiểm thử E2E giao diện Tab và Phương án 1 (Multi-Image Upload)...');

  // 1. Tạo 2 tệp ảnh mẫu nhỏ để test upload file thực tế
  const testImagesDir = path.resolve('temp_test_images');
  if (!fs.existsSync(testImagesDir)) {
    fs.mkdirSync(testImagesDir, { recursive: true });
  }

  // Tạo ảnh PNG tối giản hợp lệ (1x1 pixel PNG)
  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );
  const testFile1 = path.join(testImagesDir, 'mon_an_chinh.png');
  const testFile2 = path.join(testImagesDir, 'mon_an_phu.png');
  fs.writeFileSync(testFile1, pngBuffer);
  fs.writeFileSync(testFile2, pngBuffer);

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 950 },
  });

  const page = await context.newPage();

  try {
    // 2. Đăng nhập hệ thống
    console.log('🔑 1. Đăng nhập tài khoản Author...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', 'DoanThanh.Ly25@hotmail.com');
    await page.fill('input[type="password"]', 'Author@123456');
    await page.click('button[type="submit"]');

    // Chờ lưu token và điều hướng
    await page.waitForTimeout(2000);
    console.log('✅ Đã đăng nhập, tiến hành chuyển tới Dashboard Đăng công thức...');

    // 3. Điều hướng đến trang Đăng công thức (tab=recipes-create)
    console.log('🧭 2. Điều hướng đến trang Đăng công thức (tab=recipes-create)...');
    await page.goto('http://localhost:3000/dashboard?tab=recipes-create', { waitUntil: 'networkidle' });

    // Đảm bảo các Tab đã hiển thị trên màn hình
    await page.waitForSelector('text=1. Thông tin chung & Dinh dưỡng');
    await page.waitForSelector('text=2. Hình ảnh món ăn');
    await page.waitForSelector('text=3. Nguyên liệu');
    await page.waitForSelector('text=4. Các bước nấu');
    console.log('✅ Xác nhận 4 Tab đã hiển thị đầy đủ và rõ ràng trên giao diện.');

    // 4. Kiểm tra Tab 1: Thông tin chung & Dinh dưỡng
    console.log('📝 3. Kiểm tra và điền dữ liệu Tab 1 (Thông tin chung & Dinh dưỡng)...');
    await page.fill('input[name="title"]', 'Bò xào lúc lắc rau củ tươi ngon (E2E Test)');
    await page.fill(
      'textarea[name="description"]',
      'Món bò xào lúc lắc đậm đà hương vị, giàu protein và vitamin từ rau củ tươi sạch.'
    );

    // Chọn danh mục
    const categorySelect = page.locator('select[name="categoryId"]');
    await categorySelect.waitFor();
    const options = await categorySelect.locator('option').all();
    if (options.length > 1) {
      const secondOptionVal = await options[1].getAttribute('value');
      if (secondOptionVal) await categorySelect.selectOption(secondOptionVal);
    }

    // Chọn độ khó, thời gian, khẩu phần
    await page.selectOption('select[name="difficulty"]', '2');
    await page.fill('input[name="prepTimeMinutes"]', '20');
    await page.fill('input[name="cookTimeMinutes"]', '15');
    await page.fill('input[name="servings"]', '4');

    // Ghi chú của tác giả
    await page.fill(
      'textarea[name="instructions"]',
      'Thịt bò nên chọn thăn mềm, ướp cùng chút dầu ăn và tỏi băm để khi xào không bị khô dai.'
    );

    // Dinh dưỡng ước tính
    await page.fill('input[name="calories"]', '380');
    await page.fill('input[name="protein"]', '28');
    await page.fill('input[name="carbs"]', '22');
    await page.fill('input[name="fat"]', '14');

    const tab1ScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_tab1_general_nutrition.png');
    await page.screenshot({ path: tab1ScreenshotPath, fullPage: false });
    console.log(`📸 Chụp ảnh Tab 1 lưu tại: ${tab1ScreenshotPath}`);

    // 5. Chuyển sang Tab 2: Hình ảnh món ăn (Phương án 1)
    console.log('🖼️ 4. Chuyển sang Tab 2 (Hình ảnh món ăn) và kiểm tra Phương án 1 Multi-Upload...');
    await page.click('button:has-text("2. Hình ảnh món ăn")');
    await page.waitForTimeout(500);

    // Tải lên 2 file ảnh test vào dropzone
    console.log('📤 Đang chọn cùng lúc 2 tệp ảnh từ máy tính...');
    const fileInput = page.locator('#multi-file-upload');
    await fileInput.setInputFiles([testFile1, testFile2]);
    await page.waitForTimeout(1000);

    // Kiểm tra hiển thị Thumbnail Strip
    await page.waitForSelector('text=Ảnh đã chọn (2)');
    console.log('✅ Xác nhận dải ảnh Thumbnail Strip đã hiển thị 2 ảnh vừa chọn.');

    // Kiểm tra ảnh đầu tiên có huy hiệu "Ảnh chính"
    const primaryBadge = page.locator('text=Ảnh chính').first();
    const isPrimaryVisible = await primaryBadge.isVisible();
    console.log(`✅ Ảnh đầu tiên tự động gắn huy hiệu "Ảnh chính": ${isPrimaryVisible}`);

    // Đổi ảnh thứ 2 thành ảnh chính bằng cách click nút "Đặt làm ảnh chính"
    console.log('⭐ Kiểm tra thao tác chuyển đổi ảnh đại diện chính...');
    const setPrimaryBtn = page.locator('button:has-text("Đặt làm ảnh chính")').first();
    if (await setPrimaryBtn.isVisible()) {
      await setPrimaryBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ Đã bấm Đặt làm ảnh chính cho ảnh thứ 2.');
    }

    const tab2ScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_tab2_gallery_option1.png');
    await page.screenshot({ path: tab2ScreenshotPath, fullPage: false });
    console.log(`📸 Chụp ảnh Tab 2 lưu tại: ${tab2ScreenshotPath}`);

    // 6. Chuyển sang Tab 3: Nguyên liệu chuẩn bị
    console.log('🥩 5. Chuyển sang Tab 3 (Nguyên liệu chuẩn bị)...');
    await page.click('button:has-text("3. Nguyên liệu")');
    await page.waitForTimeout(500);

    // Điền nguyên liệu 1
    await page.fill('input[placeholder*="Tên nguyên liệu 1"]', 'Thịt bò thăn');
    await page.fill('input[name="ingredients.0.quantity"]', '400');
    await page.fill('input[name="ingredients.0.unit"]', 'g');
    await page.fill('input[name="ingredients.0.notes"]', 'Cắt quân cờ vuông 2cm');

    // Bấm thêm nguyên liệu 2
    await page.click('button:has-text("Thêm nguyên liệu mới")');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder*="Tên nguyên liệu 2"]', 'Ớt chuông Đà Lạt');
    await page.fill('input[name="ingredients.1.quantity"]', '2');
    await page.fill('input[name="ingredients.1.unit"]', 'quả');
    await page.fill('input[name="ingredients.1.notes"]', 'Cắt miếng vuông');

    const tab3ScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_tab3_ingredients.png');
    await page.screenshot({ path: tab3ScreenshotPath, fullPage: false });
    console.log(`📸 Chụp ảnh Tab 3 lưu tại: ${tab3ScreenshotPath}`);

    // 7. Chuyển sang Tab 4: Các bước nấu
    console.log('🍳 6. Chuyển sang Tab 4 (Các bước nấu)...');
    await page.click('button:has-text("4. Các bước nấu")');
    await page.waitForTimeout(500);

    // Điền bước 1
    await page.fill('input[placeholder*="Tiêu đề bước 1"]', 'Sơ chế và ướp thịt bò');
    await page.fill('input[name="steps.0.timerMinutes"]', '15');
    await page.fill(
      'textarea[placeholder*="Hướng dẫn chi tiết bước 1"]',
      'Thịt bò rửa sạch, thấm khô, cắt miếng vuông quân cờ. Ướp cùng 1 thìa tỏi băm, 1 thìa dầu hào, tiêu xay.'
    );

    // Thêm bước 2
    await page.click('button:has-text("Thêm bước thực hiện")');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder*="Tiêu đề bước 2"]', 'Xào lúc lắc trên chảo lớn');
    await page.fill('input[name="steps.1.timerMinutes"]', '5');
    await page.fill(
      'textarea[placeholder*="Hướng dẫn chi tiết bước 2"]',
      'Đun chảo thật nóng, cho tỏi và bơ vào phi thơm, trút thịt bò vào lắc đều tay trong 2 phút trên lửa cực lớn.'
    );

    const tab4ScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_tab4_steps.png');
    await page.screenshot({ path: tab4ScreenshotPath, fullPage: false });
    console.log(`📸 Chụp ảnh Tab 4 lưu tại: ${tab4ScreenshotPath}`);

    // 8. Bấm "Tạo công thức ngay" và xác nhận quá trình submit
    console.log('💾 7. Bấm nút "Tạo công thức ngay" và kiểm tra luồng tạo & upload ảnh phụ...');
    await page.click('button[type="submit"]:has-text("Tạo công thức ngay")');

    // Chờ quá trình upload ảnh chính lên MinIO, tạo recipe, và tải ảnh phụ
    await page.waitForURL('**/dashboard?tab=recipes-edit**', { timeout: 30000 });
    console.log('🎉 Đã tạo thành công và chuyển hướng vào Recipe Studio!');

    await page.waitForTimeout(2000);
    const studioScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_recipe_created_in_studio.png');
    await page.screenshot({ path: studioScreenshotPath, fullPage: false });
    console.log(`📸 Chụp ảnh kết quả Recipe Studio lưu tại: ${studioScreenshotPath}`);

    console.log('🌟 TẤT CẢ CÁC BƯỚC KIỂM THỬ E2E ĐÃ HOÀN TẤT THÀNH CÔNG 100%!');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình kiểm thử E2E:', error);
    const errorScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_error.png');
    await page.screenshot({ path: errorScreenshotPath, fullPage: false });
    console.log(`📸 Đã chụp ảnh màn hình lỗi tại: ${errorScreenshotPath}`);
    throw error;
  } finally {
    await browser.close();
  }
}

runTest();
