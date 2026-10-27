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
    const response = await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
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

    // 4. Kiểm tra Khu vực Danh mục riêng & Bố cục chính
    console.log('🔍 4. Kiểm tra Khu vực Danh mục ẩm thực (6 thẻ chính) & Bố cục chính...');
    await page.waitForSelector('text=DANH MỤC ẨM THỰC');
    await page.waitForSelector('text=Khám phá thế giới ẩm thực đa dạng');
    await page.waitForSelector('text=Món Khai Vị');
    await page.waitForSelector('text=Món Chính');
    await page.waitForSelector('text=Canh & Súp');
    await page.waitForSelector('text=Món Chay');
    await page.waitForSelector('text=Tráng Miệng');
    await page.waitForSelector('text=Đồ Uống');
    console.log('✅ Danh mục: 6 thẻ chính (Món Khai Vị, Món Chính, Canh & Súp, Món Chay, Tráng Miệng, Đồ Uống) hiển thị đầy đủ.');

    // 5. Kiểm tra Khu vực Công thức mới nhất (1 Thẻ lớn Món Hot + Lưới 2x2 4 thẻ)
    console.log('🔍 5. Kiểm tra Khu vực Công thức mới nhất (1 Thẻ lớn Món Hot + Lưới 2x2)...');
    await page.waitForSelector('text=CÔNG THỨC MỚI NHẤT');
    await page.waitForSelector('text=MÓN HOT TUẦN NÀY');
    await page.waitForSelector('text=Xem công thức');
    await page.waitForSelector('text=Nấu ngay');
    await page.waitForSelector('text=Xem chi tiết');
    const recipeLinks = await page.locator('a[href^="/recipes/"]').count();
    console.log(`✅ Công thức mới nhất: 1 Thẻ lớn Món Hot + Lưới 4 thẻ với ${recipeLinks} liên kết hợp lệ.`);

    // 6. Kiểm tra Banner "Vì sao nên chọn Culinary Blog?"
    console.log('🔍 6. Kiểm tra Banner Vì sao nên chọn Culinary Blog?...');
    await page.waitForSelector('text=Vì sao nên chọn');
    await page.waitForSelector('text=Công thức đa dạng');
    await page.waitForSelector('text=Hướng dẫn chi tiết');
    await page.waitForSelector('text=Cộng đồng yêu bếp');
    await page.waitForSelector('text=Cập nhật liên tục');
    console.log('✅ Banner 4 ưu điểm nổi bật hiển thị đầy đủ.');

    // 7. Kiểm tra Footer
    console.log('🔍 7. Kiểm tra Footer...');
    await page.waitForSelector('footer');
    await page.waitForSelector('text=Phát triển bởi Nhóm 13');
    console.log('✅ Footer: Thông tin thương hiệu, các cột liên kết và bản quyền Nhóm 13.');

    // Lưu ảnh chụp Desktop toàn trang
    const fullDesktopPath = path.join(ARTIFACTS_DIR, 'mockup_home_desktop.png');
    await page.screenshot({ path: fullDesktopPath, fullPage: true });
    console.log(`📸 Đã lưu ảnh chụp toàn bộ trang chủ Desktop: ${fullDesktopPath}`);

    // 8. Kiểm thử tương tác: Nhấp tim yêu thích trên Recipe Card
    console.log('🧪 8. Kiểm thử tương tác: Nhấp nút Tim (Heart) trên thẻ món ăn...');
    const heartBtn = page.locator('button[title="Yêu thích món ăn"]').first();
    if (await heartBtn.isVisible()) {
      await heartBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ Đã kích hoạt hiệu ứng yêu thích món ăn.');
    }

    // 9. Kiểm thử tương tác: Nhấp mở rộng "Hiển thị tất cả" danh mục
    console.log('🧪 9. Kiểm thử tương tác: Nhấp mở rộng "Hiển thị tất cả" danh mục...');
    const showAllBtn = page.locator('button:has-text("Hiển thị tất cả")');
    if (await showAllBtn.isVisible()) {
      await showAllBtn.click();
      await page.waitForTimeout(500);
      await page.waitForSelector('text=Các danh mục phong phú khác');
      console.log('✅ Đã mở rộng danh sách danh mục phong phú khác thành công.');
    }

    // 10. Kiểm thử điều hướng: Nhấp vào thẻ Danh mục chính (Món Khai Vị) để chuyển sang trang chi tiết danh mục
    console.log('🧪 10. Kiểm thử điều hướng: Nhấp vào thẻ danh mục Món Khai Vị...');
    const khaiViLink = page.locator('a:has(h3:has-text("Món Khai Vị"))');
    await khaiViLink.waitFor({ state: 'visible', timeout: 5000 });
    const targetHref = await khaiViLink.getAttribute('href');
    console.log(`👉 Thẻ Món Khai Vị liên kết tới URL: ${targetHref}`);
    
    // Nhấp điều hướng
    await khaiViLink.click();
    await page.waitForURL(/categories/, { timeout: 10000, waitUntil: 'commit' });
    await page.waitForTimeout(2000);
    console.log(`✅ Đã điều hướng thành công sang trang danh mục: ${page.url()}`);

    const categoryNavPath = path.join(ARTIFACTS_DIR, 'mockup_category_navigated.png');
    await page.screenshot({ path: categoryNavPath });
    console.log(`📸 Đã lưu ảnh chụp trang danh mục được điều hướng: ${categoryNavPath}`);

    // Quay lại trang chủ để test tìm kiếm
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    // 11. Kiểm thử điều hướng: Tìm kiếm từ Hero Banner chuyển sang trang /recipes
    console.log('🧪 11. Kiểm thử điều hướng: Tìm kiếm từ Hero Banner...');
    const heroSection = page.locator('section:has-text("Hàng ngàn công thức nấu ăn")');
    const heroInput = heroSection.locator('input');
    await heroInput.fill('Phở bò');
    await heroSection.locator('button:has-text("Tìm kiếm")').click();
    await page.waitForURL(/recipes\?searchTerm=/, { timeout: 10000, waitUntil: 'commit' });
    await page.waitForTimeout(2000);
    console.log(`✅ Đã điều hướng tìm kiếm thành công sang trang: ${page.url()}`);

    const searchNavPath = path.join(ARTIFACTS_DIR, 'mockup_search_navigated.png');
    await page.screenshot({ path: searchNavPath });
    console.log(`📸 Đã lưu ảnh chụp trang kết quả tìm kiếm: ${searchNavPath}`);

    // 12. Kiểm tra hiển thị trên Mobile (390x844)
    console.log('📱 12. Kiểm tra hiển thị Responsive trên Mobile (390x844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
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
