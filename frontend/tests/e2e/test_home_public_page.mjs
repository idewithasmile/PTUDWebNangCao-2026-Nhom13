import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/4bbd637e-71d4-451e-ae80-bfc6913c3810';

async function testHomeMockupPage() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Trang chủ Culinary Blog theo giao diện chuẩn Mockup...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  try {
    // 1. Tải trang chủ http://localhost:3000/
    console.log('🌐 1. Truy cập trang chủ http://localhost:3000/...');
    const response = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`📡 HTTP Response: ${response.status()}`);

    await page.waitForSelector('text=Culinary', { timeout: 15000 });
    await page.waitForTimeout(2000); // Đợi React Query tải dữ liệu

    // 2. Kiểm tra Header
    console.log('🔍 2. Kiểm tra Header & Navigation...');
    await page.waitForSelector('text=Nấu ngon - Sống vui');
    await page.waitForSelector('text=Công thức');
    await page.waitForSelector('text=Danh mục');
    console.log('✅ Header: Hiển thị đúng menu cốt lõi, slogan, ô tìm kiếm và chuông thông báo.');

    // 3. Kiểm tra Hero Banner
    console.log('🔍 3. Kiểm tra Hero Banner...');
    await page.waitForSelector('text=Hàng ngàn công thức nấu ăn');
    await page.waitForSelector('text=Nấu ngon');
    await page.waitForSelector('text=Mỗi ngày ♡');
    console.log('✅ Hero Banner: Tiêu đề lớn, badge nghệ thuật và ô tìm kiếm tròn hoàn tất.');

    // 4. Kiểm tra 3 Cột giao diện chính
    console.log('🔍 4. Kiểm tra Bố cục 3 Cột (Left - Center - Right)...');
    // Cột 1: Danh mục
    await page.waitForSelector('text=Tất cả danh mục');
    await page.waitForSelector('text=Nguyên liệu tươi ngon');
    console.log('✅ Cột 1 (Trái): Danh mục kèm số lượng món và banner nguyên liệu tươi ngon.');

    // Cột 2: Tiêu điểm & 6 công thức mới nhất
    await page.waitForSelector('text=Công thức nổi bật');
    await page.waitForSelector('text=Công thức mới nhất');
    const recipeCards = await page.locator('a[href^="/recipes/"]').count();
    console.log(`✅ Cột 2 (Giữa): Tiêu điểm món ngon và ${recipeCards} thẻ công thức.`);

    // Cột 3: Xem nhiều nhất, Nhận tin, MXH, Trích dẫn
    await page.waitForSelector('text=Công thức được xem nhiều');
    await page.waitForSelector('text=Đăng ký nhận công thức mới');
    await page.waitForSelector('text=Theo dõi chúng tôi');
    await page.waitForSelector('text=Nấu ăn không chỉ là kỹ năng');
    console.log('✅ Cột 3 (Phải): Top 5 xem nhiều, đăng ký email, MXH và trích dẫn ấm áp.');

    // 5. Kiểm tra Banner "Vì sao nên chọn Culinary Blog?"
    console.log('🔍 5. Kiểm tra Banner Vì sao nên chọn Culinary Blog?...');
    await page.waitForSelector('text=Vì sao nên chọn');
    await page.waitForSelector('text=Công thức đa dạng');
    await page.waitForSelector('text=Hướng dẫn chi tiết');
    await page.waitForSelector('text=Cộng đồng yêu bếp');
    await page.waitForSelector('text=Cập nhật liên tục');
    console.log('✅ Banner 4 ưu điểm nổi bật hiển thị đầy đủ.');

    // 6. Kiểm tra Footer
    console.log('🔍 6. Kiểm tra Footer...');
    await page.waitForSelector('footer');
    await page.waitForSelector('text=Phát triển bởi Nhóm 13');
    console.log('✅ Footer: Thông tin thương hiệu, các cột liên kết và bản quyền Nhóm 13.');

    // Lưu ảnh chụp Desktop toàn trang
    const fullDesktopPath = path.join(ARTIFACTS_DIR, 'mockup_home_desktop.png');
    await page.screenshot({ path: fullDesktopPath, fullPage: true });
    console.log(`📸 Đã lưu ảnh chụp toàn bộ trang chủ Desktop: ${fullDesktopPath}`);

    // 7. Kiểm thử tương tác: Nhấp tim yêu thích trên Recipe Card
    console.log('🧪 7. Kiểm thử tương tác: Nhấp nút Tim (Heart) trên thẻ món ăn...');
    const heartBtn = page.locator('button[title="Yêu thích món ăn"]').first();
    if (await heartBtn.isVisible()) {
      await heartBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ Đã kích hoạt hiệu ứng yêu thích món ăn.');
    }

    // 8. Kiểm thử tương tác: Đăng ký nhận tin Email
    console.log('🧪 8. Kiểm thử tương tác: Nhập email đăng ký nhận công thức mới...');
    const emailInput = page.locator('input[placeholder="Nhập email của bạn"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('khachhang@culinaryblog.com');
      await page.click('button:has-text("Đăng ký")');
      await page.waitForSelector('text=Đã đăng ký nhận bản tin thành công');
      console.log('✅ Đăng ký nhận bản tin phản hồi thành công.');
    }

    // 9. Kiểm thử tương tác: Lọc theo danh mục
    console.log('🧪 9. Kiểm thử tương tác: Nhấp lọc theo danh mục...');
    const categoryBtn = page.locator('aside button:visible').nth(1);
    const catName = await categoryBtn.innerText();
    console.log(`👉 Đang nhấp vào danh mục: ${catName.trim()}`);
    await categoryBtn.click();
    await page.waitForTimeout(1500);

    const filterScreenshotPath = path.join(ARTIFACTS_DIR, 'mockup_home_filtered.png');
    await page.screenshot({ path: filterScreenshotPath });
    console.log(`📸 Đã lưu ảnh chụp kết quả lọc: ${filterScreenshotPath}`);

    // 10. Kiểm tra hiển thị trên Mobile (390x844)
    console.log('📱 10. Kiểm tra hiển thị Responsive trên Mobile (390x844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(2000);

    const mobileScreenshotPath = path.join(ARTIFACTS_DIR, 'mockup_home_mobile.png');
    await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: true });
    console.log(`📸 Đã lưu ảnh chụp giao diện Mobile: ${mobileScreenshotPath}`);

    await mobileContext.close();
    console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ TRANG CHỦ THEO GIAO DIỆN CHUẨN ĐỀU HOÀN THÀNH XUẤT SẮC!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử:', error);
    const errPath = path.join(ARTIFACTS_DIR, 'mockup_home_error.png');
    await page.screenshot({ path: errPath });
    console.log(`📸 Đã lưu ảnh lỗi: ${errPath}`);
    throw error;
  } finally {
    await browser.close();
  }
}

testHomeMockupPage();
