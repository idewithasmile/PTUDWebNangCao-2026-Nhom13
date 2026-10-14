import { Suspense } from 'react';
import RecipesClientView from '@/components/recipes/RecipesClientView';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Công thức Nấu ăn | Culinary Blog',
  description: 'Khám phá hàng ngàn công thức nấu ăn ngon, phong phú và dễ làm.',
};

export default function RecipesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <RecipesClientView />
    </Suspense>
  );
}
