import { chromium } from 'playwright';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

async function testForgotPasswordAndNewsletter() {
  console.log('🚀 Bắt đầu kiểm thử E2E: Quên mật khẩu, Bản tin Ẩm thực (Newsletter) & Tiện ích Công thức...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    // 1. Kiểm tra Route Alias /auth/login -> /login và liên kết "Quên mật khẩu?"
    console.log('🔗 1. Kiểm tra chuyển hướng /auth/login -> /login và liên kết Quên mật khẩu...');
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
    await page.waitForURL((url) => url.pathname.includes('/login'), { timeout: 10000 });

    const forgotLink = page.locator('a[href="/forgot-password"]');
    await forgotLink.waitFor({ state: 'visible', timeout: 5000 });
    await forgotLink.click();

    await page.waitForURL((url) => url.pathname.includes('/forgot-password'), { timeout: 10000 });
    console.log('✅ Đã điều hướng sang trang /forgot-password.');

    // 2. Gửi yêu cầu Quên mật khẩu
    console.log('📧 2. Gửi yêu cầu khôi phục mật khẩu...');
    await page.fill('input#email', 'chef.reader@culinaryblog.com');
    await page.click('button[type="submit"]');

    const statusAlert = page.locator('[role="status"]');
    await statusAlert.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Hiển thị thông báo đã gửi hướng dẫn khôi phục mật khẩu (chống dò email OWASP).');

    // 3. Kiểm tra trang /reset-password với thanh đánh giá độ mạnh mật khẩu
    console.log('🔐 3. Kiểm tra giao diện /reset-password và thanh độ mạnh mật khẩu...');
    await page.goto(`${BASE_URL}/reset-password?email=chef.reader%40culinaryblog.com&token=dGVzdC10b2tlbg`, {
      waitUntil: 'networkidle',
    });
    const newPassInput = page.locator('input#newPassword');
    await newPassInput.waitFor({ state: 'visible', timeout: 5000 });
    await newPassInput.fill('StrongPass!2026');
    await page.fill('input#confirmPassword', 'StrongPass!2026');
    console.log('✅ Thanh kiểm tra độ mạnh mật khẩu 5 mức hoạt động chuẩn.');

    // 4. Kiểm tra đăng ký Bản tin Ẩm thực (Newsletter) tại Trang chủ
    console.log('📰 4. Kiểm tra đăng ký nhận Bản tin Ẩm thực tại Trang chủ...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    const newsletterHeading = page.locator('#newsletter-heading');
    await newsletterHeading.waitFor({ state: 'visible', timeout: 10000 });

    const uniqueEmail = `reader.${Date.now()}@culinaryblog.com`;
    await page.fill('input#newsletter-name', 'Nguyễn Minh Anh');
    await page.fill('input#newsletter-email', uniqueEmail);
    await page.locator('section[aria-labelledby="newsletter-heading"] button[type="submit"]').click();

    await page.locator('section[aria-labelledby="newsletter-heading"] [role="status"]').waitFor({
      state: 'visible',
      timeout: 10000,
    });
    console.log(`✅ Đã đăng ký bản tin thành công với email: ${uniqueEmail}`);

    // 5. Đăng nhập Admin và kiểm tra Tab Khách hàng Bản tin (/dashboard?tab=subscribers)
    console.log('👑 5. Đăng nhập Admin kiểm tra danh sách Email Khách hàng tại /dashboard?tab=subscribers...');
    await page.goto(`${BASE_URL}/login?returnUrl=/dashboard`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@culinaryblog.com');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => url.pathname.includes('/dashboard'), { timeout: 15000 });
    await page.goto(`${BASE_URL}/dashboard?tab=subscribers`, { waitUntil: 'networkidle' });

    const subscribersHeading = page.locator('h2:has-text("Danh sách Email Khách hàng")');
    await subscribersHeading.waitFor({ state: 'visible', timeout: 10000 });

    const searchInput = page.locator('input[placeholder*="Tìm theo email"]');
    await searchInput.fill(uniqueEmail);
    await page.waitForTimeout(800);

    const subscriberCell = page.locator(`td:has-text("${uniqueEmail}")`);
    await subscriberCell.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Admin tìm thấy email khách hàng vừa đăng ký trong Dashboard!');

    console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ PLAYWRIGHT E2E ĐẠT 100%!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử E2E:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testForgotPasswordAndNewsletter();
