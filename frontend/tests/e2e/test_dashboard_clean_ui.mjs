import { chromium } from 'playwright';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/4bbd637e-71d4-451e-ae80-bfc6913c3810';

async function testDashboardCleanUI() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Xác minh giao diện Dashboard đã loại bỏ các mục không liên quan...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    // 1. Đăng nhập với tài khoản Admin
    console.log('🔑 1. Đăng nhập tài khoản Admin...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@culinaryblog.com');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => url.pathname.includes('/dashboard'), { timeout: 15000 });
    console.log('✅ Đã đăng nhập vào Dashboard.');
    await page.waitForTimeout(2000);

    // 2. Kiểm tra Sidebar
    console.log('🔍 2. Kiểm tra danh sách menu trên Sidebar...');
    const sidebarText = await page.locator('aside').innerText();

    const checkExcluded = (name) => {
      const exists = sidebarText.includes(name);
      console.log(`- Mục "${name}": ${exists ? '❌ VẪN CÒN (LỖI)' : '✅ ĐÃ LOẠI BỎ (ĐẠT)'}`);
      if (exists) throw new Error(`Mục "${name}" vẫn còn xuất hiện trên Sidebar!`);
    };

    checkExcluded('Bình luận');
    checkExcluded('Tệp tin');
    checkExcluded('Công việc');
    checkExcluded('Thống kê');
    checkExcluded('Tác giả');
    checkExcluded('Đã lên lịch');
    checkExcluded('Thùng rác');

    // Kiểm tra các mục hợp lệ
    const checkIncluded = (name) => {
      const exists = sidebarText.includes(name);
      console.log(`- Mục hợp lệ "${name}": ${exists ? '✅ HIỂN THỊ ĐẦY ĐỦ' : '❌ THIẾU'}`);
      if (!exists) throw new Error(`Mục hợp lệ "${name}" bị thiếu trên Sidebar!`);
    };

    checkIncluded('Tổng quan');
    checkIncluded('Bài viết');
    checkIncluded('Đăng công thức');
    checkIncluded('Danh mục');
    checkIncluded('Cài đặt');

    // 3. Kiểm tra trang Tổng quan (Overview)
    console.log('📸 3. Chụp ảnh màn hình Tổng quan sạch (Overview)...');
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/mockup_dashboard_clean_overview.png`,
      fullPage: false,
    });
    console.log('✅ Đã chụp mockup_dashboard_clean_overview.png');

    // 4. Kiểm tra trang Bài viết (Recipes)
    console.log('🧭 4. Điều hướng sang tab Bài viết (tab=recipes)...');
    await page.goto('http://localhost:3000/dashboard?tab=recipes', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const recipesContent = await page.locator('body').innerText();
    const hasFakeCommentInRecipes = recipesContent.includes('bình luận');
    console.log(`- Kiểm tra chữ "bình luận" trong trang bài viết: ${hasFakeCommentInRecipes ? '❌ VẪN CÒN' : '✅ KHÔNG CÒN (ĐẠT)'}`);

    await page.screenshot({
      path: `${ARTIFACTS_DIR}/mockup_dashboard_clean_recipes.png`,
      fullPage: false,
    });
    console.log('✅ Đã chụp mockup_dashboard_clean_recipes.png');

    // 5. Kiểm tra trang Danh mục (Categories)
    console.log('🧭 5. Điều hướng sang tab Danh mục (tab=categories)...');
    await page.goto('http://localhost:3000/dashboard?tab=categories', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/mockup_dashboard_clean_categories.png`,
      fullPage: false,
    });
    console.log('✅ Đã chụp mockup_dashboard_clean_categories.png');

    // 6. Kiểm tra trang Cài đặt (Settings)
    console.log('🧭 6. Điều hướng sang tab Cài đặt (tab=settings)...');
    await page.goto('http://localhost:3000/dashboard?tab=settings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/mockup_dashboard_clean_settings.png`,
      fullPage: false,
    });
    console.log('✅ Đã chụp mockup_dashboard_clean_settings.png');

    console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ DASHBOARD SẠCH ĐỀU THÀNH CÔNG RỰC RỠ!');
  } catch (err) {
    console.error('❌ Kiểm thử thất bại:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testDashboardCleanUI();
