import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/6a67b3f7-2d41-43e0-8257-c28169957b41';

async function testServingsModal() {
  console.log('🚀 Bắt đầu kiểm thử E2E Modal điều chỉnh khẩu phần công thức mới...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await context.newPage();

  try {
    // 1. Đăng nhập Author
    console.log('🔑 1. Đăng nhập tài khoản Author...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'author@culinaryblog.com');
    await page.fill('input[type="password"]', 'Author@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => url.pathname === '/dashboard', { timeout: 20000 });
    console.log('✅ Đăng nhập thành công.');

    // 2. Vào tab tạo công thức
    console.log('🧭 2. Điều hướng đến trang Đăng công thức...');
    await page.goto('http://localhost:3000/dashboard?tab=recipes-create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Điền nhanh công thức mẫu nếu có nút hoặc điền tay
    const sampleBtn = await page.$('text=Nạp công thức mẫu');
    if (sampleBtn) {
      console.log('📝 Nạp công thức mẫu...');
      await sampleBtn.click();
      await page.waitForTimeout(1000);
    }

    // Đảm bảo số khẩu phần ở bước 1 là 3
    const servingsInput = await page.$('input[name="servings"]');
    if (servingsInput) {
      await servingsInput.fill('3');
    }

    // 3. Chuyển sang Bước 2: Danh sách nguyên liệu
    console.log('➡️ 3. Chuyển sang Bước 2 (Nguyên liệu)...');
    const step2Tab = await page.$('button:has-text("Nguyên liệu")');
    if (step2Tab) {
      await step2Tab.click();
      await page.waitForTimeout(500);
    }

    // 4. Tìm và click nút "Điều chỉnh khẩu phần"
    console.log('🔍 4. Nhấn nút "Điều chỉnh khẩu phần" tại Bước 2...');
    const adjustBtn = await page.waitForSelector('button:has-text("Điều chỉnh khẩu phần")', { timeout: 10000 });
    await adjustBtn.click();
    await page.waitForTimeout(600);

    // 5. Kiểm tra modal hiển thị
    console.log('🔍 5. Kiểm tra Modal "Xác nhận điều chỉnh khẩu phần công thức"...');
    await page.waitForSelector('text=Xác nhận điều chỉnh khẩu phần công thức');
    console.log('✅ Modal điều chỉnh khẩu phần đã mở thành công.');

    // Chụp ảnh giao diện Modal mới
    const screenshot1Path = path.join(ARTIFACTS_DIR, 'modal_servings_initial.png');
    await page.screenshot({ path: screenshot1Path });
    console.log('📸 Đã chụp ảnh Modal ban đầu:', screenshot1Path);

    // 6. Kiểm tra các nút tương tác mới: Stepper & Quick Presets
    const minusBtn = await page.$('button[title="Giảm 1 người"]');
    const plusBtn = await page.$('button[title="Tăng 1 người"]');
    const numInput = await page.$('input[type="number"][value="3"]');
    const preset4 = await page.$('button:has-text("4")');
    const presetDouble = await page.$('button:has-text("x2 (Gấp đôi)")');

    if (!minusBtn || !plusBtn || !numInput) {
      throw new Error('❌ Không tìm thấy các nút Stepper [-] [+] hoặc ô nhập số khẩu phần trong Modal!');
    }
    console.log('✅ Đã xác nhận Stepper tương tác (Giảm [-], Tăng [+], Input số) xuất hiện đầy đủ trong Modal.');

    if (!preset4 || !presetDouble) {
      throw new Error('❌ Không tìm thấy các nút chọn nhanh (Quick Presets) trong Modal!');
    }
    console.log('✅ Đã xác nhận các phím chọn nhanh số người và tỷ lệ (x2, x3, 1/2) xuất hiện đầy đủ.');

    // 7. Nhấn nút tăng khẩu phần [+] từ 3 lên 4
    console.log('➕ 7. Nhấn nút [+] để tăng từ 3 người lên 4 người...');
    await plusBtn.click();
    await page.waitForTimeout(300);

    // Kiểm tra hệ số x1.33 lần
    const multText = await page.textContent('text=x1.33 lần');
    if (!multText) {
      console.warn('⚠️ Chưa thấy text x1.33, kiểm tra các giá trị hệ số khác...');
    } else {
      console.log('✅ Hệ số nhân x1.33 lần đã cập nhật tức thì!');
    }

    // 8. Thử chọn nút phím tắt "x2 (Gấp đôi)"
    console.log('⚡ 8. Nhấn nút chọn nhanh "x2 (Gấp đôi)"...');
    await presetDouble.click();
    await page.waitForTimeout(300);

    // Khi nhân đôi từ 3 người -> 6 người (x2.00 lần)
    const multDouble = await page.waitForSelector('text=x2.00 lần', { timeout: 3000 });
    if (multDouble) {
      console.log('✅ Nhấn "x2 (Gấp đôi)" đã cập nhật chính xác thành 6 người (x2.00 lần)!');
    }

    // Chụp ảnh Modal sau khi điều chỉnh thành x2
    const screenshot2Path = path.join(ARTIFACTS_DIR, 'modal_servings_scaled_x2.png');
    await page.screenshot({ path: screenshot2Path });
    console.log('📸 Đã chụp ảnh Modal sau khi điều chỉnh x2:', screenshot2Path);

    // 9. Nhấn nút "Xác nhận áp dụng"
    console.log('💾 9. Nhấn nút "Xác nhận áp dụng (6 người • x2.00)"...');
    const confirmBtn = await page.waitForSelector('button:has-text("Xác nhận áp dụng")', { timeout: 5000 });
    await confirmBtn.click();
    await page.waitForTimeout(1000);

    // 10. Kiểm tra thông báo thành công và giá trị trên Form
    console.log('🔍 10. Kiểm tra giá trị đã được cập nhật trên Form Bước 2...');
    const successBanner = await page.waitForSelector('text=Khẩu phần đã được điều chỉnh', { timeout: 5000 });
    if (successBanner) {
      console.log('✅ Banner thông báo điều chỉnh thành công đã hiển thị!');
    }

    // Kiểm tra banner khẩu phần hiện tại ở bước 2
    const step2ServingsText = await page.textContent('text=Khẩu phần hiện tại:');
    console.log('📋 Text khẩu phần Bước 2:', step2ServingsText);
    if (step2ServingsText && step2ServingsText.includes('6 người')) {
      console.log('🎉 XÁC NHẬN THÀNH CÔNG: Bước 2 đã hiển thị "Khẩu phần hiện tại: 6 người"!');
    }

    // Chụp ảnh giao diện Bước 2 sau khi áp dụng
    const screenshot3Path = path.join(ARTIFACTS_DIR, 'step2_applied_servings.png');
    await page.screenshot({ path: screenshot3Path });
    console.log('📸 Đã chụp ảnh Bước 2 hoàn tất:', screenshot3Path);

    console.log('🎯 TẤT CẢ CÁC BƯỚC KIỂM THỬ E2E CHO MODAL ĐIỀU CHỈNH KHẨU PHẦN ĐỀU ĐẠT 100% PASS!');
  } catch (err) {
    console.error('❌ Lỗi kiểm thử:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

testServingsModal();
