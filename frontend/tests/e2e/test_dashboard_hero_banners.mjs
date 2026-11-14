import { chromium } from 'playwright';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001';

async function testDashboardHeroBanners() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Xác thực Hero Banner xuyên suốt Dashboard...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    // 1. Đăng nhập Admin
    console.log('🔑 1. Đăng nhập Admin...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@culinaryblog.com');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => url.pathname.includes('/dashboard'), { timeout: 15000 });
    console.log('✅ Đã đăng nhập vào Dashboard.');
    await page.waitForTimeout(2000);

    // 2. Chụp Tab Overview (Tổng quan)
    console.log('📸 2. Chụp ảnh Tab Tổng quan (Overview)...');
    await page.screenshot({ path: `${ARTIFACTS_DIR}/dashboard_banner_overview.png`, fullPage: false });
    console.log('✅ Đã lưu dashboard_banner_overview.png');

    // 3. Chuyển sang Tab Quản lý công thức
    console.log('📸 3. Kiểm tra & Chụp ảnh Tab Quản lý Công thức (Recipes)...');
    await page.goto('http://localhost:3000/dashboard?tab=recipes', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const recipesBannerTitle = page.locator('h1:has-text("Kho công thức ẩm thực")');
    await recipesBannerTitle.waitFor({ state: 'visible', timeout: 5000 });
    await page.screenshot({ path: `${ARTIFACTS_DIR}/dashboard_banner_recipes.png`, fullPage: false });
    console.log('✅ Đã lưu dashboard_banner_recipes.png');

    // 4. Chuyển sang Tab Quản lý danh mục
    console.log('📸 4. Kiểm tra & Chụp ảnh Tab Quản lý Danh mục (Categories)...');
    await page.goto('http://localhost:3000/dashboard?tab=categories', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const categoriesBannerTitle = page.locator('h1:has-text("Cơ cấu danh mục ẩm thực")');
    await categoriesBannerTitle.waitFor({ state: 'visible', timeout: 5000 });
    await page.screenshot({ path: `${ARTIFACTS_DIR}/dashboard_banner_categories.png`, fullPage: false });
    console.log('✅ Đã lưu dashboard_banner_categories.png');

    // 5. Chuyển sang Tab Quản lý người dùng & tác giả
    console.log('📸 5. Kiểm tra & Chụp ảnh Tab Quản lý Người dùng & Tác giả (Users)...');
    await page.goto('http://localhost:3000/dashboard?tab=users', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const usersBannerTitle = page.locator('h1:has-text("Quản lý Người dùng & Tác giả")');
    await usersBannerTitle.waitFor({ state: 'visible', timeout: 5000 });
    await page.screenshot({ path: `${ARTIFACTS_DIR}/dashboard_banner_users.png`, fullPage: false });
    console.log('✅ Đã lưu dashboard_banner_users.png');

    // 6. Chuyển sang Tab Thêm công thức mới
    console.log('📸 6. Kiểm tra & Chụp ảnh Tab Thêm công thức mới (Create)...');
    await page.goto('http://localhost:3000/dashboard?tab=recipes-create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const createBannerTitle = page.locator('h1:has-text("Thêm công thức mới")');
    await createBannerTitle.waitFor({ state: 'visible', timeout: 5000 });
    await page.screenshot({ path: `${ARTIFACTS_DIR}/dashboard_banner_recipe_create.png`, fullPage: false });
    console.log('✅ Đã lưu dashboard_banner_recipe_create.png');

    console.log('🎉 TẤT CẢ CÁC BANNER TRÊN TẤT CẢ CÁC TAB ĐỀU HOÀN TOÀN CHUẨN XÁC VÀ ĐẸP MẮT!');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình kiểm thử E2E:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testDashboardHeroBanners();
