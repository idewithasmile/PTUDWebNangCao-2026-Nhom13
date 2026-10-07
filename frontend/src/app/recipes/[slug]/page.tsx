import type { Metadata } from 'next';
import { recipeService } from '@/lib/services/recipe-service';
import RecipeDetailView from '@/components/recipes/RecipeDetailView';

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO Metadata Generation (Next.js 15)
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const recipe = await recipeService.getRecipeBySlug(slug);
    const primaryImage =
      recipe.images.find((img) => img.isPrimary)?.originalUrl ||
      recipe.images[0]?.originalUrl;

    return {
      title: `${recipe.title} | Culinary Blog`,
      description: recipe.description,
      openGraph: {
        title: recipe.title,
        description: recipe.description,
        type: 'article',
        publishedTime: recipe.publishedAt || recipe.createdAt,
        authors: [recipe.authorName || 'Culinary Blog'],
        images: primaryImage ? [{ url: primaryImage }] : [],
      },
    };
  } catch {
    return {
      title: 'Công thức Nấu ăn | Culinary Blog',
      description: 'Chi tiết công thức nấu ăn ngon và hấp dẫn.',
    };
  }
}

// 2. Main Detail Page Component with JSON-LD Schema.org Recipe
export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { slug } = await params;

  // Lấy trước dữ liệu ở server side để render JSON-LD Schema.org Recipe cho Google SEO
  let jsonLd = null;
  try {
    const recipe = await recipeService.getRecipeBySlug(slug);
    const primaryImage =
      recipe.images.find((img) => img.isPrimary)?.originalUrl ||
      recipe.images[0]?.originalUrl;

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.title,
      description: recipe.description,
      author: {
        '@type': 'Person',
        name: recipe.authorName || 'Tác giả Culinary Blog',
      },
      datePublished: recipe.publishedAt || recipe.createdAt,
      prepTime: `PT${recipe.prepTimeMinutes}M`,
      cookTime: `PT${recipe.cookTimeMinutes}M`,
      totalTime: `PT${recipe.prepTimeMinutes + recipe.cookTimeMinutes}M`,
      recipeYield: `${recipe.servings} phần`,
      image: primaryImage ? [primaryImage] : [],
      recipeCategory: recipe.categoryName,
      recipeIngredient: recipe.ingredients.map((ing) =>
        `${ing.quantity ?? ''} ${ing.unit ?? ''} ${ing.name}`.trim()
      ),
      recipeInstructions: recipe.steps.map((step) => ({
        '@type': 'HowToStep',
        name: step.title || `Bước ${step.stepNumber}`,
        text: step.description,
      })),
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
    // Nếu lỗi fetch ở SSR (vd nháp/chưa login), JSON-LD bỏ qua, client view sẽ handle 403/404
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <RecipeDetailView slug={slug} />
    </>
  );
}
