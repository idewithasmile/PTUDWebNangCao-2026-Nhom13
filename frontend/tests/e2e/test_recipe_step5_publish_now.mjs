import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/4bbd637e-71d4-451e-ae80-bfc6913c3810';

async function runTestPublishNow() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Luồng Xuất bản công khai ngay từ Bước 5 (Live Preview & Publish)...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  try {
    // 1. Đăng nhập tài khoản Author
    console.log('🔑 1. Đăng nhập tài khoản Author...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', 'DoanThanh.Ly25@hotmail.com');
    await page.fill('input[type="password"]', 'Author@123456');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    console.log('✅ Đã đăng nhập thành công vào Dashboard.');
    await page.waitForTimeout(1000);

    // 2. Chuyển sang tab Đăng công thức
    console.log('🧭 2. Điều hướng đến trang Đăng công thức (tab=recipes-create)...');
    await page.goto('http://localhost:3000/dashboard?tab=recipes-create', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Thông tin & Dinh dưỡng');

    // 3. Điền thông tin Tab 1
    const uniqueTitle = `Bò Bít Tết Sốt Tiêu Đen Chuẩn Vị E2E ${Date.now()}`;
    console.log(`📝 3. Điền thông tin Tab 1 với tiêu đề: "${uniqueTitle}"...`);
    await page.fill('input[name="title"]', uniqueTitle);
    await page.fill(
      'textarea[name="description"]',
      'Món bò bít tết thăn ngoại áp chảo bơ tỏi thơm lừng, ăn kèm sốt tiêu đen cay nồng và măng tây áp chảo giòn ngọt.'
    );

    const categorySelect = page.locator('select[name="categoryId"]');
    await categorySelect.waitFor();
    const catOptions = await categorySelect.locator('option').all();
    if (catOptions.length > 1) {
      const val = await catOptions[1].getAttribute('value');
      if (val) await categorySelect.selectOption(val);
    }

    await page.fill('input[name="prepTimeMinutes"]', '15');
    await page.fill('input[name="cookTimeMinutes"]', '10');
    await page.fill('input[name="servings"]', '2');
    await page.fill('input[name="calories"]', '520');
    await page.fill('input[name="protein"]', '42');
    await page.fill('input[name="carbs"]', '8');
    await page.fill('input[name="fat"]', '32');
    await page.fill(
      'textarea[name="instructions"]',
      'Nên để miếng thịt bò ráo nước và nghỉ ở nhiệt độ phòng 15 phút trước khi áp chảo.'
    );

    // 4. Tab 2: Chọn ảnh mẫu nhanh
    console.log('🖼️ 4. Chuyển sang Tab 2 và chọn ảnh mẫu...');
    await page.click('button:has-text("Thư viện hình ảnh")');
    await page.waitForTimeout(500);

    const sampleBtn = page.locator('button:has-text("Món nướng / Xào")').first();
    if (await sampleBtn.isVisible()) {
      await sampleBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ Đã chọn ảnh mẫu Món nướng / Xào.');
    }

    // 5. Tab 3: Điền nguyên liệu
    console.log('🥩 5. Chuyển sang Tab 3 và điền nguyên liệu...');
    await page.click('button:has-text("Nguyên liệu")');
    await page.waitForTimeout(500);

    await page.fill('input[placeholder*="Tên nguyên liệu 1"]', 'Thăn ngoại bò Wagyu');
    await page.fill('input[name="ingredients.0.quantity"]', '350');
    await page.fill('input[name="ingredients.0.unit"]', 'g');
    await page.fill('input[name="ingredients.0.notes"]', 'Dày 2.5cm');

    await page.click('button:has-text("Thêm nguyên liệu mới")');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder*="Tên nguyên liệu 2"]', 'Hạt tiêu đen Phú Quốc');
    await page.fill('input[name="ingredients.1.quantity"]', '1');
    await page.fill('input[name="ingredients.1.unit"]', 'thìa canh');

    // 6. Tab 4: Điền các bước làm
    console.log('🍳 6. Chuyển sang Tab 4 và điền các bước nấu...');
    await page.click('button:has-text("Các bước thực hiện")');
    await page.waitForTimeout(500);

    await page.fill('input[placeholder*="Tiêu đề bước 1"]', 'Ướp muối tiêu');
    await page.fill('input[name="steps.0.timerMinutes"]', '5');
    await page.fill(
      'textarea[placeholder*="Hướng dẫn chi tiết bước 1"]',
      'Rắc đều muối biển và tiêu đen giã dập lên cả 2 mặt miếng thịt bò.'
    );

    await page.click('button:has-text("Thêm bước thực hiện")');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder*="Tiêu đề bước 2"]', 'Áp chảo lửa lớn');
    await page.fill('input[name="steps.1.timerMinutes"]', '6');
    await page.fill(
      'textarea[placeholder*="Hướng dẫn chi tiết bước 2"]',
      'Đun chảo gang thật nóng, áp chảo mỗi mặt 3 phút với bơ, hương thảo và tỏi đập dập.'
    );

    // 7. Tab 5: Chuyển sang Xem trước & Xuất bản
    console.log('👁️ 7. Nhấn "Tiếp tục: Xem trước bài viết" để vào Step 5...');
    await page.click('button:has-text("Tiếp tục: Xem trước bài viết")');
    await page.waitForTimeout(1000);

    await page.waitForSelector('text=Xem trước bài viết & Quyết định đăng tải');
    await page.waitForSelector('text=Đủ điều kiện xuất bản công khai');

    const previewScreenshot = path.join(ARTIFACTS_DIR, 'e2e_step5_preview_before_publish.png');
    await page.screenshot({ path: previewScreenshot, fullPage: true });
    console.log(`📸 Chụp ảnh màn hình toàn trang Step 5 lưu tại: ${previewScreenshot}`);

    // Cuộn xuống thanh quyết định và chụp ảnh chi tiết
    const decisionBarScreenshot = path.join(ARTIFACTS_DIR, 'e2e_step5_decision_bar.png');
    const decisionSection = page.locator('button:has-text("Xuất bản công khai ngay")');
    await decisionSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: decisionBarScreenshot, fullPage: false });
    console.log(`📸 Chụp ảnh cận cảnh thanh quyết định lưu tại: ${decisionBarScreenshot}`);

    // 8. Bấm nút "Xuất bản công khai ngay"
    console.log('🚀 8. Bấm nút "Xuất bản công khai ngay" và kiểm tra điều hướng đến trang bài viết công khai...');
    const publishBtn = page.locator('button:has-text("Xuất bản công khai ngay")');
    await publishBtn.click();

    // Chờ quá trình tạo công thức, gọi publishRecipe, và điều hướng đến /recipes/{slug}
    await page.waitForURL('**/recipes/**', { timeout: 30000 });
    console.log(`🎉 Điều hướng thành công đến trang bài viết công khai: ${page.url()}`);

    await page.waitForTimeout(2000);
    const liveArticleScreenshot = path.join(ARTIFACTS_DIR, 'e2e_live_published_article.png');
    await page.screenshot({ path: liveArticleScreenshot, fullPage: false });
    console.log(`📸 Chụp ảnh bài viết công khai thực tế lưu tại: ${liveArticleScreenshot}`);

    console.log('🌟 KIỂM THỬ XUẤT BẢN CÔNG KHAI NGAY TỪ BƯỚC 5 ĐÃ HOÀN TẤT THÀNH CÔNG 100%!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử E2E Xuất bản ngay:', error);
    const errPath = path.join(ARTIFACTS_DIR, 'e2e_publish_now_error.png');
    await page.screenshot({ path: errPath, fullPage: false });
    throw error;
  } finally {
    await browser.close();
  }
}

runTestPublishNow();
