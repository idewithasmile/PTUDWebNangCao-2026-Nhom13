// ------------------------------------------------------------------------------------------------
// Trang Chi Tiết Công Thức Nấu Ăn (Server Component - Next.js 15 App Router)
// Nhiệm vụ: NFR-SEO-001 đến NFR-SEO-004 (Metadata động, Open Graph Tags, JSON-LD Schema.org Recipe)
// Kỹ thuật áp dụng:
// - ISR (Incremental Static Regeneration) với chu kỳ 300 giây (5 phút).
// - Server-side fetching trích xuất dữ liệu để tối ưu SEO cho công cụ tìm kiếm Google.
// - Nhúng cấu trúc dữ liệu Rich Snippets Recipe giúp Google hiển thị sao đánh giá, thời gian, calo trên kết quả tìm kiếm.
// ------------------------------------------------------------------------------------------------

import type { Metadata } from 'next';
import { recipeService } from '@/lib/services/recipe-service';
import RecipeDetailView from '@/components/recipes/RecipeDetailView';

// Cấu hình ISR: Trang được lưu cache tĩnh trong 300 giây (5 phút), sau đó Next.js sẽ tái tạo ngầm khi có người truy cập mới
export const revalidate = 300;

interface RecipePageProps {
  // Trong Next.js 15, params là một Promise bất đồng bộ, cần dùng await params để lấy dữ liệu
  params: Promise<{ slug: string }>;
}

// ================================================================================================
// 1. Hàm generateMetadata: Sinh thẻ meta SEO động theo từng bài viết (NFR-SEO-002, NFR-SEO-003)
// Chạy hoàn toàn trên máy chủ (Server-side) trước khi gửi HTML về trình duyệt.
// ================================================================================================
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    // Gọi API lấy thông tin công thức theo Slug (bỏ qua log lỗi nếu công thức nháp hoặc không tìm thấy)
    const recipe = await recipeService.getRecipeBySlug(slug, {
      suppressLogError: true,
    } as RequestInit);

    // Xác định hình ảnh đại diện chính (ưu tiên ảnh có cờ isPrimary = true, nếu không lấy ảnh đầu tiên)
    const primaryImage =
      recipe.images.find((img) => img.isPrimary)?.originalUrl ||
      recipe.images[0]?.originalUrl;

    // Trả về đối tượng Metadata chuẩn của Next.js:
    return {
      title: `${recipe.title} | Culinary Blog`, // Tiêu đề hiển thị trên tab trình duyệt và Google Search
      description: recipe.description,          // Thẻ meta description tóm tắt nội dung
      openGraph: {                             // Giao thức Open Graph (hiển thị đẹp khi chia sẻ link lên Facebook, Zalo)
        title: recipe.title,
        description: recipe.description,
        type: 'article',                        // Loại nội dung là bài báo / bài viết ẩm thực
        publishedTime: recipe.publishedAt || recipe.createdAt,
        authors: [recipe.authorName || 'Culinary Blog'],
        images: primaryImage ? [{ url: primaryImage }] : [], // Ảnh thumbnail khi share link
      },
    };
  } catch {
    // Fallback mặc định nếu công thức không tồn tại hoặc có lỗi truy vấn
    return {
      title: 'Công thức Nấu ăn | Culinary Blog',
      description: 'Chi tiết công thức nấu ăn ngon và hấp dẫn.',
    };
  }
}

// ================================================================================================
// 2. Component Trang Chi Tiết: Render JSON-LD Schema.org Recipe (NFR-SEO-001)
// Cung cấp dữ liệu có cấu trúc để Google Bot nhận diện đây là công thức nấu ăn thực thụ
// ================================================================================================
export default async function RecipeDetailPage({ params }: RecipePageProps) {
  // Trích xuất slug từ Promise params (cơ chế async params bắt buộc từ Next.js 15)
  const { slug } = await params;

  let jsonLd = null;
  try {
    // Lấy dữ liệu công thức trên Server để chuẩn bị dữ liệu Rich Snippets
    const recipe = await recipeService.getRecipeBySlug(slug, {
      suppressLogError: true,
    } as RequestInit);

    const primaryImage =
      recipe.images.find((img) => img.isPrimary)?.originalUrl ||
      recipe.images[0]?.originalUrl;

    // Cấu trúc Schema.org Recipe chuẩn quốc tế:
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',                                      // Định danh loại Schema là Recipe
      name: recipe.title,                                     // Tên món ăn
      description: recipe.description,                        // Mô tả món ăn
      author: {
        '@type': 'Person',
        name: recipe.authorName || 'Tác giả Culinary Blog',   // Tên tác giả
      },
      datePublished: recipe.publishedAt || recipe.createdAt, // Ngày xuất bản bài viết
      prepTime: `PT${recipe.prepTimeMinutes}M`,               // Thời gian chuẩn bị theo chuẩn ISO 8601 (ví dụ PT15M = 15 phút)
      cookTime: `PT${recipe.cookTimeMinutes}M`,               // Thời gian nấu theo chuẩn ISO 8601 (ví dụ PT30M = 30 phút)
      totalTime: `PT${recipe.prepTimeMinutes + recipe.cookTimeMinutes}M`, // Tổng thời gian chế biến
      recipeYield: `${recipe.servings} phần`,                 // Số lượng khẩu phần ăn
      image: primaryImage ? [primaryImage] : [],              // Danh sách URL ảnh minh họa
      recipeCategory: recipe.categoryName,                   // Thể loại món ăn
      // Danh sách nguyên liệu dạng chuỗi gộp "Số lượng + Đơn vị + Tên nguyên liệu"
      recipeIngredient: recipe.ingredients.map((ing) =>
        `${ing.quantity ?? ''} ${ing.unit ?? ''} ${ing.name}`.trim()
      ),
      // Danh sách các bước chế biến dạng HowToStep
      recipeInstructions: recipe.steps.map((step) => ({
        '@type': 'HowToStep',
        name: step.title || `Bước ${step.stepNumber}`,
        text: step.description,
      })),
      // Thông tin dinh dưỡng nếu có (Calories, Protein, Carb, Fat)
      nutrition: recipe.nutrition?.calories
        ? {
            '@type': 'NutritionInformation',
            calories: `${recipe.nutrition.calories} calories`,
            proteinContent: recipe.nutrition.protein
              ? `${recipe.nutrition.protein} g`
              : undefined,
            carbohydrateContent: recipe.nutrition.carbohydrates
              ? `${recipe.nutrition.carbohydrates} g`
              : undefined,
            fatContent: recipe.nutrition.fat
              ? `${recipe.nutrition.fat} g`
              : undefined,
          }
        : undefined,
    };
  } catch {
    // Nếu có lỗi fetch ở SSR (ví dụ bài Draft riêng tư hoặc người dùng chưa login), bỏ qua JSON-LD để client view xử lý
  }

  return (
    <>
      {/* Nhúng mã JSON-LD vào thẻ script type="application/ld+json" để Google Web Crawler thu thập */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Component Client xử lý toàn bộ tương tác người dùng: Bookmark, Chỉnh khẩu phần, Cooking Mode, Bình luận */}
      <RecipeDetailView slug={slug} />
    </>
  );
}
