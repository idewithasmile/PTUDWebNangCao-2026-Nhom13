import { chromium } from 'playwright';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001';

async function testRecipeFormCleanState() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Xác minh RecipeForm Clean State & Empty State...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    // 1. Đăng nhập
    console.log('🔑 1. Đăng nhập với tài khoản Admin...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard?tab=recipes-create', {
      waitUntil: 'networkidle',
    });
    await page.fill('input[type="email"]', 'admin@culinaryblog.com');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => url.searchParams.get('tab') === 'recipes-create', { timeout: 15000 });
    console.log('✅ Đã vào trang Tạo công thức mới (/dashboard?tab=recipes-create).');
    await page.waitForTimeout(2000);

    // 2. Xác minh Thông tin cơ bản sạch sẽ
    console.log('🔍 2. Kiểm tra ô tải ảnh đại diện & các trường số...');
    const uploadText = await page.locator('text=Tải ảnh đại diện').isVisible();
    if (!uploadText) {
      throw new Error('Khung tải ảnh đại diện trống không hiển thị (vẫn bị gán ảnh cũ)!');
    }
    console.log('  ✓ Khung tải ảnh đại diện: Trống sạch sẽ, hiển thị đúng "Tải ảnh đại diện"');

    // Kiểm tra các trường input
    const titleVal = await page.locator('input[placeholder*="tên công thức"]').inputValue();
    const prepTimeVal = await page.locator('input[name="prepTimeMinutes"]').inputValue();
    const cookTimeVal = await page.locator('input[name="cookTimeMinutes"]').inputValue();
    const servingsVal = await page.locator('input[name="servings"]').inputValue();

    console.log(`  - Title: "${titleVal}" (kỳ vọng rỗng)`);
    console.log(`  - PrepTime: "${prepTimeVal}" (kỳ vọng rỗng)`);
    console.log(`  - CookTime: "${cookTimeVal}" (kỳ vọng rỗng)`);
    console.log(`  - Servings: "${servingsVal}" (kỳ vọng rỗng)`);

    if (titleVal !== '' || prepTimeVal !== '' || cookTimeVal !== '' || servingsVal !== '') {
      throw new Error('Các trường thông tin cơ bản vẫn bị điền sẵn dữ liệu mặc định!');
    }
    console.log('  ✓ Toàn bộ trường thông tin cơ bản: Hoàn toàn trống (Clean State)!');

    // Chụp ảnh Thông tin cơ bản sạch
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/recipe_form_clean_basic_info.png`,
      fullPage: false,
    });
    console.log('  📸 Đã chụp recipe_form_clean_basic_info.png');

    // 3. Kiểm tra Tab Quy trình chế biến (Empty State)
    console.log('🔍 3. Kiểm tra Tab Quy trình chế biến...');
    await page.click('button:has-text("Quy trình chế biến")');
    await page.waitForTimeout(600);

    const emptyStepsText = await page.locator('text=Chưa có bước chế biến nào').isVisible();
    const addFirstStepBtn = await page.locator('text=Thêm bước đầu tiên').isVisible();

    if (!emptyStepsText || !addFirstStepBtn) {
      throw new Error('Empty State của Quy trình chế biến không hiển thị!');
    }
    console.log('  ✓ Quy trình chế biến: Hiển thị đúng Empty State và nút "Thêm bước đầu tiên"!');

    await page.screenshot({
      path: `${ARTIFACTS_DIR}/recipe_form_clean_steps_empty.png`,
      fullPage: false,
    });
    console.log('  📸 Đã chụp recipe_form_clean_steps_empty.png');

    // 4. Kiểm tra Tab Nguyên liệu chi tiết (Empty State)
    console.log('🔍 4. Kiểm tra Tab Nguyên liệu chi tiết...');
    await page.click('button:has-text("Nguyên liệu chi tiết")');
    await page.waitForTimeout(600);

    const emptyIngredientsText = await page.locator('text=Chưa có nguyên liệu nào').isVisible();
    const addFirstIngBtn = await page.locator('text=Thêm nguyên liệu đầu tiên').isVisible();

    if (!emptyIngredientsText || !addFirstIngBtn) {
      throw new Error('Empty State của Nguyên liệu chi tiết không hiển thị!');
    }
    console.log('  ✓ Nguyên liệu chi tiết: Hiển thị đúng Empty State và nút "Thêm nguyên liệu đầu tiên"!');

    await page.screenshot({
      path: `${ARTIFACTS_DIR}/recipe_form_clean_ingredients_empty.png`,
      fullPage: false,
    });
    console.log('  📸 Đã chụp recipe_form_clean_ingredients_empty.png');

    // 5. Kiểm tra tính năng "✨ Điền mẫu nhanh"
    console.log('✨ 5. Kiểm tra nút "Điền mẫu nhanh"...');
    await page.click('button:has-text("Điền mẫu nhanh")');
    await page.waitForTimeout(1000);

    const filledTitle = await page.locator('input[placeholder*="tên công thức"]').inputValue();
    const filledPrep = await page.locator('input[name="prepTimeMinutes"]').inputValue();
    console.log(`  - Title sau khi điền mẫu: "${filledTitle}"`);
    console.log(`  - PrepTime sau khi điền mẫu: "${filledPrep}"`);

    if (!filledTitle.includes('Bò Xào Bông Cải Xanh') || filledPrep !== '15') {
      throw new Error('Tính năng Điền mẫu nhanh không hoạt động chính xác!');
    }
    console.log('  ✓ Nút "Điền mẫu nhanh" hoạt động hoàn hảo khi người dùng chủ động yêu cầu!');

    await page.screenshot({
      path: `${ARTIFACTS_DIR}/recipe_form_sample_data_filled.png`,
      fullPage: false,
    });
    console.log('  📸 Đã chụp recipe_form_sample_data_filled.png');

    console.log('🎉 100% KIỂM THỬ THÀNH CÔNG! RecipeForm đã trở về Clean State chuẩn mực!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử E2E:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testRecipeFormCleanState();
