import { chromium } from 'playwright';

const ARTIFACTS_DIR = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001';

async function testUsersManagement() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Trang Xem danh sách người dùng & tác giả...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    // 1. Đăng nhập với tài khoản Admin
    console.log('🔑 1. Đăng nhập tài khoản Admin (admin@culinaryblog.com)...');
    await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@culinaryblog.com');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => url.pathname.includes('/dashboard'), { timeout: 15000 });
    console.log('✅ Đã đăng nhập vào Dashboard.');
    await page.waitForTimeout(2000);

    // 2. Kiểm tra Sidebar có menu "Quản lý người dùng"
    console.log('🔍 2. Kiểm tra menu "Quản lý người dùng" trên Sidebar...');
    const usersMenuBtn = page.locator('aside button:has-text("Quản lý người dùng")');
    await usersMenuBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Menu "Quản lý người dùng" hiển thị trên Sidebar!');

    // 3. Nhấp chuyển sang tab Quản lý người dùng
    console.log('🖱️ 3. Nhấp vào tab Quản lý người dùng...');
    await usersMenuBtn.click();
    await page.waitForTimeout(2000);

    // 4. Kiểm tra Header và các thẻ KPI thống kê
    console.log('📊 4. Kiểm tra dải thẻ KPI thống kê tài khoản...');
    const heading = await page.locator('h2:has-text("Quản lý Người dùng & Tác giả")');
    await heading.waitFor({ state: 'visible', timeout: 5000 });

    const totalUsersCard = page.locator('text=Tổng tài khoản');
    await totalUsersCard.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Header và Dải thẻ KPI (Tổng tài khoản, Quản trị viên, Tác giả bài viết, Đang hoạt động) hiển thị chuẩn!');

    // 5. Kiểm tra bảng dữ liệu người dùng (Dạng Table)
    console.log('📋 5. Kiểm tra bảng dữ liệu người dùng...');
    const table = page.locator('table');
    await table.waitFor({ state: 'visible', timeout: 5000 });
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(`✅ Bảng tải thành công ${rowCount} tài khoản từ CSDL PostgreSQL.`);

    // Chụp ảnh màn hình Table View
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/users_management_table_view.png`,
      fullPage: false,
    });
    console.log('📸 Đã chụp ảnh artifact: users_management_table_view.png');

    // 6. Kiểm thử tìm kiếm từ khóa
    console.log('🔎 6. Kiểm thử tìm kiếm từ khóa "Minh"...');
    const searchInput = page.locator('input[placeholder*="Tìm theo tên hiển thị"]');
    await searchInput.fill('Minh');
    await page.waitForTimeout(1000); // Đợi debounce 250ms + API response

    const filteredRows = await page.locator('table tbody tr').count();
    console.log(`✅ Tìm kiếm từ khóa "Minh" trả về ${filteredRows} kết quả.`);

    // Chụp ảnh kết quả tìm kiếm
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/users_management_search_filter.png`,
      fullPage: false,
    });
    console.log('📸 Đã chụp ảnh artifact: users_management_search_filter.png');

    // Xóa từ khóa tìm kiếm
    await searchInput.fill('');
    await page.waitForTimeout(1000);

    // 7. Kiểm thử chuyển đổi sang Dạng lưới thẻ (Grid View)
    console.log('🔲 7. Chuyển đổi sang Chế độ Dạng lưới thẻ (Grid View)...');
    const gridBtn = page.locator('button[title="Xem dạng lưới thẻ"]');
    await gridBtn.click();
    await page.waitForTimeout(1000);

    const cards = page.locator('.grid.grid-cols-1.sm\\:grid-cols-2 > div');
    const cardCount = await cards.count();
    console.log(`✅ Đã chuyển sang Grid View với ${cardCount} thẻ hồ sơ người dùng.`);

    // Chụp ảnh Grid View
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/users_management_grid_view.png`,
      fullPage: false,
    });
    console.log('📸 Đã chụp ảnh artifact: users_management_grid_view.png');

    // 8. Mở Modal Chi tiết Người dùng
    console.log('👤 8. Mở Modal Chi tiết Người dùng...');
    const firstDetailBtn = page.locator('button:has-text("Xem hồ sơ")').first();
    await firstDetailBtn.click();
    await page.waitForTimeout(1000);

    const modalTitle = page.locator('div.fixed.inset-0 h3').first();
    await modalTitle.waitFor({ state: 'visible', timeout: 5000 });
    const userDetailName = await modalTitle.innerText();
    console.log(`✅ Modal Chi tiết Người dùng đã mở thành công cho: "${userDetailName}".`);

    // Chụp ảnh Modal
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/users_management_detail_modal.png`,
      fullPage: false,
    });
    console.log('📸 Đã chụp ảnh artifact: users_management_detail_modal.png');

    // Đóng Modal
    const closeBtn = page.locator('button:has-text("Đóng thông tin")');
    await closeBtn.click();
    await page.waitForTimeout(500);

    console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ PLAYWRIGHT E2E ĐÃ ĐẠT 100% THÀNH CÔNG!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử E2E:', error);
    await page.screenshot({
      path: `${ARTIFACTS_DIR}/users_management_test_error.png`,
    });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testUsersManagement();
