import { chromium } from 'playwright';

async function testDashboardInlinePreview() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

  console.log('1. Đăng nhập hệ thống...');
  await page.goto('http://localhost:3000/login?returnUrl=/dashboard', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'author@culinaryblog.com');
  await page.fill('input[type="password"]', 'Author@123456');
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => u.pathname.includes('/dashboard'));
  await page.waitForTimeout(1000);

  console.log('2. Mở trang Tạo công thức (/dashboard?tab=recipes-create)...');
  await page.goto('http://localhost:3000/dashboard?tab=recipes-create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Điền nhanh dữ liệu mẫu
  const fillSampleBtn = page.locator('button:has-text("Mẫu chuẩn")').first();
  if (await fillSampleBtn.isVisible()) {
    console.log('2.1. Bấm nút Mẫu chuẩn...');
    await fillSampleBtn.click();
    await page.waitForTimeout(1000);
  }

  console.log('3. Chuyển sang chế độ Xem trước trong Dashboard...');
  // Bấm nút Xem trước ở footer hoặc bấm Bước 4 trên Stepper
  const previewBtn = page.locator('button:has-text("Xem trước")').first();
  await previewBtn.click();
  await page.waitForTimeout(1500);

  // Kiểm tra thanh điều khiển xem trước trong Dashboard
  const stickyHeader = page.locator('div:has-text("Xem trước trong Dashboard")').first();
  console.log('Header xem trước hiển thị:', await stickyHeader.isVisible());

  const topOutPath = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001/test_dashboard_preview_top.png';
  await page.screenshot({ path: topOutPath, fullPage: false });
  console.log('✅ Đã chụp ảnh Dashboard Preview Top:', topOutPath);

  // Cuộn xuống để xem toàn bộ nội dung chi tiết
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(1000);

  const middleOutPath = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001/test_dashboard_preview_details.png';
  await page.screenshot({ path: middleOutPath, fullPage: false });
  console.log('✅ Đã chụp ảnh Dashboard Preview Details (Ingredients + Steps):', middleOutPath);

  // Cuộn xuống đáy để xem sticky footer với các nút hành động (Lưu nháp, Lưu trữ, Đăng bài)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  const bottomOutPath = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001/test_dashboard_preview_footer.png';
  await page.screenshot({ path: bottomOutPath, fullPage: false });
  console.log('✅ Đã chụp ảnh Dashboard Preview Footer with Actions:', bottomOutPath);

  console.log('4. Thử nghiệm nút "Quay lại chỉnh sửa"...');
  const backEditBtn = page.locator('button:has-text("Quay lại sửa"), button:has-text("Quay lại chỉnh sửa")').last();
  await backEditBtn.click();
  await page.waitForTimeout(1000);

  const returnedEditPath = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001/test_dashboard_returned_to_edit.png';
  await page.screenshot({ path: returnedEditPath, fullPage: false });
  console.log('✅ Đã chụp ảnh sau khi Quay lại Chỉnh sửa:', returnedEditPath);

  console.log('5. Kiểm tra trên trang Chỉnh sửa công thức có sẵn...');
  await page.goto('http://localhost:3000/dashboard?tab=recipes-mine', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const editRecipeLink = page.locator('button:has-text("Chỉnh sửa"), a[href*="recipes-edit"]').first();
  if (await editRecipeLink.isVisible()) {
    await editRecipeLink.click();
    await page.waitForTimeout(1500);

    // Bấm xem trước
    const editPreviewBtn = page.locator('button:has-text("Xem trước")').first();
    if (await editPreviewBtn.isVisible()) {
      await editPreviewBtn.click();
      await page.waitForTimeout(1500);

      const editPreviewPath = 'C:/Users/Maxsys/.gemini/antigravity/brain/65389346-3f98-4476-8542-6b9f8c49a001/test_dashboard_edit_recipe_preview.png';
      await page.screenshot({ path: editPreviewPath, fullPage: false });
      console.log('✅ Đã chụp ảnh Xem trước trên trang Chỉnh sửa:', editPreviewPath);
    }
  }

  await browser.close();
  console.log('🎉 Hoàn tất kiểm thử Playwright cho Dashboard Inline Preview!');
}

testDashboardInlinePreview().catch(console.error);
