import { chromium } from 'playwright';

async function testRecipeCardsUI() {
  console.log('🚀 Launching Chromium browser to verify RecipeCard UI improvements...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    console.log('🌐 Navigating to /recipes...');
    await page.goto('http://localhost:3000/recipes', { waitUntil: 'networkidle', timeout: 30000 });

    // Chờ 2 giây để ảnh và dữ liệu nạp đầy đủ
    await page.waitForTimeout(2000);

    // Chụp toàn màn hình danh sách công thức
    await page.screenshot({
      path: 'C:/Users/Maxsys/.gemini/antigravity/brain/4bbd637e-71d4-451e-ae80-bfc6913c3810/mockup_recipes_catalog.png',
      fullPage: false,
    });
    console.log('📸 Captured mockup_recipes_catalog.png');

    // Chụp cận cảnh 3 thẻ đầu tiên
    const firstThreeCards = await page.locator('div.grid > a').first();
    await firstThreeCards.waitFor({ state: 'visible', timeout: 10000 });

    // Lấy thẻ danh sách grid
    const grid = page.locator('div.grid').first();
    await grid.screenshot({
      path: 'C:/Users/Maxsys/.gemini/antigravity/brain/4bbd637e-71d4-451e-ae80-bfc6913c3810/mockup_recipe_cards_detail.png',
    });
    console.log('📸 Captured mockup_recipe_cards_detail.png');

    // Kiểm tra các phần tử trên card
    const cardContent = await grid.innerText();
    console.log('Card content sample:');
    console.log(cardContent.slice(0, 500));

    // Kiểm tra không còn chữ 'bởi '
    const hasWordBoi = cardContent.includes('bởi Tác Giả') || cardContent.includes('bởi Đầu bếp');
    console.log(`Kiểm tra chữ "bởi": ${hasWordBoi ? 'VẪN CÒN (LỖI)' : 'ĐÃ ĐƯỢC LOẠI BỎ (ĐẠT)'}`);

    // Kiểm tra có ngày đăng dạng DD/MM/YYYY
    const hasDatePattern = /\d{2}\/\d{2}\/\d{4}/.test(cardContent);
    console.log(`Kiểm tra ngày đăng (DD/MM/YYYY): ${hasDatePattern ? 'ĐÃ HIỂN THỊ (ĐẠT)' : 'CHƯA CÓ (CẦN KIỂM TRA)'}`);

    console.log('🎉 Test Recipe Cards UI completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testRecipeCardsUI();
