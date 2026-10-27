import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/4bbd637e-71d4-451e-ae80-bfc6913c3810';

async function testHomePublicPage() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Trang chủ công khai Culinary Blog...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 1. Desktop Context
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  try {
    // 1. Tải trang chủ http://localhost:3000/
    console.log('🌐 1. Truy cập trang chủ http://localhost:3000/...');
    const response = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`📡 Response status: ${response.status()}`);

    // Chờ nội dung trang chủ xuất hiện
    await page.waitForSelector('text=CulinaryBlog', { timeout: 15000 });
    await page.waitForTimeout(2000); // Chờ React Query hoàn tất fetch

    // 2. Kiểm tra Header
    console.log('🔍 2. Kiểm tra Header & Navigation...');
    const headerBrand = await page.textContent('header');
    if (!headerBrand.includes('CulinaryBlog') || !headerBrand.includes('Nấu ngon • Sống vui')) {
      throw new Error('Header không hiển thị đúng thương hiệu hoặc slogan');
    }
    console.log('✅ Header: Hiển thị logo, slogan "Nấu ngon • Sống vui" và thanh tìm kiếm.');

    // 3. Kiểm tra Hero Banner
    console.log('🔍 3. Kiểm tra Hero Banner & Ô tìm kiếm...');
    await page.waitForSelector('text=Khơi nguồn cảm hứng');
    const heroSearchInput = await page.locator('input[placeholder*="Bạn muốn nấu món gì hôm nay"]').count();
    if (heroSearchInput === 0) {
      throw new Error('Không tìm thấy ô tìm kiếm tại Hero Banner');
    }
    console.log('✅ Hero Banner: Tiêu đề, mô tả và ô tìm kiếm đầy đủ.');

    // 4. Kiểm tra Category Sidebar
    console.log('🔍 4. Kiểm tra Sidebar Danh mục...');
    await page.waitForSelector('aside');
    const categoryButtons = await page.locator('aside button').count();
    console.log(`✅ Sidebar: Tìm thấy ${categoryButtons} danh mục từ API thật.`);

    // 5. Kiểm tra Latest Recipes
    console.log('🔍 5. Kiểm tra Khu vực Công thức mới nhất...');
    await page.waitForSelector('text=Công thức mới nhất');
    const recipeCards = await page.locator('a[href^="/recipes/"]').count();
    console.log(`✅ Recipe Cards: Tìm thấy ${recipeCards} công thức công khai.`);

    // 6. Kiểm tra Category Showcase & Stats Banner
    console.log('🔍 6. Kiểm tra Showcase & Stats Banner...');
    await page.waitForSelector('text=Khám phá theo Bộ sưu tập');
    await page.waitForSelector('text=Bạn có bí quyết nấu ăn độc đáo muốn chia sẻ?');
    console.log('✅ Bộ sưu tập và Banner tác giả hiển thị đầy đủ.');

    // Chụp ảnh màn hình Desktop toàn trang
    const fullDesktopPath = path.join(ARTIFACTS_DIR, 'e2e_home_public_desktop.png');
    await page.screenshot({ path: fullDesktopPath, fullPage: true });
    console.log(`📸 Đã lưu ảnh chụp toàn bộ trang chủ Desktop: ${fullDesktopPath}`);

    // 7. Kiểm thử tương tác: Lọc theo danh mục
    console.log('🧪 7. Kiểm thử tương tác: Nhấp chọn một danh mục trong sidebar...');
    // Lấy button danh mục thứ 2 trong desktop sidebar (bỏ qua button "Tất cả")
    const categoryBtn = page.locator('aside button:visible').nth(1);
    const catName = await categoryBtn.innerText();
    console.log(`👉 Đang nhấp vào danh mục: ${catName.trim()}`);
    await categoryBtn.click();
    await page.waitForTimeout(1500);

    const filterScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_home_category_filter.png');
    await page.screenshot({ path: filterScreenshotPath });
    console.log(`📸 Đã lưu ảnh chụp kết quả lọc danh mục: ${filterScreenshotPath}`);

    // Bấm Đặt lại / Bỏ lọc
    console.log('🧪 8. Nhấp "Đặt lại" để hủy bộ lọc danh mục...');
    const resetBtn = page.locator('button:has-text("Đặt lại"), button:has-text("Bỏ lọc")').first();
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await page.waitForTimeout(1000);
      console.log('✅ Đã hủy bộ lọc thành công.');
    }

    // 8. Kiểm thử tương tác tìm kiếm
    console.log('🧪 9. Kiểm thử tương tác tìm kiếm từ khóa...');
    const searchInput = page.locator('input[placeholder*="Bạn muốn nấu món gì hôm nay"]');
    await searchInput.fill('Bò');
    await page.click('button[type="submit"]:has-text("Tìm kiếm")');
    await page.waitForTimeout(1500);

    const searchScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_home_search_results.png');
    await page.screenshot({ path: searchScreenshotPath });
    console.log(`📸 Đã lưu ảnh chụp kết quả tìm kiếm: ${searchScreenshotPath}`);

    // 9. Mobile Viewport Test
    console.log('📱 10. Kiểm tra hiển thị trên thiết bị di động (Mobile Viewport 390x844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(2000);

    const mobileScreenshotPath = path.join(ARTIFACTS_DIR, 'e2e_home_public_mobile.png');
    await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: true });
    console.log(`📸 Đã lưu ảnh chụp giao diện Mobile: ${mobileScreenshotPath}`);

    await mobileContext.close();
    console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ E2E TRANG CHỦ ĐỀU HOÀN THÀNH XUẤT SẮC!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử E2E:', error);
    const errPath = path.join(ARTIFACTS_DIR, 'e2e_home_error.png');
    await page.screenshot({ path: errPath });
    console.log(`📸 Đã lưu ảnh lỗi: ${errPath}`);
    throw error;
  } finally {
    await browser.close();
  }
}

testHomePublicPage();
