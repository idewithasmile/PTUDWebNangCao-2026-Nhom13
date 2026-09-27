import Link from 'next/link';
import { RecipeSummaryDto } from '@/lib/types/category';
import { Clock, Users, UtensilsCrossed } from 'lucide-react';

interface RecipeCardProps {
  recipe: RecipeSummaryDto;
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Dễ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  2: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  3: { label: 'Khó', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  4: { label: 'Chuyên gia', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const diff = difficultyLabels[recipe.difficulty] || difficultyLabels[1];

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {recipe.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.thumbnailUrl}
            alt={recipe.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
            <UtensilsCrossed className="h-12 w-12 text-orange-300" />
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur bg-white/90 ${diff.color}`}
          >
            {diff.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {recipe.title}
        </h4>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>{totalTime} phút</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-orange-500" />
            <span>{recipe.servings} phần</span>
          </div>

          {recipe.authorName && (
            <span className="text-gray-400 truncate max-w-[100px]">bởi {recipe.authorName}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
