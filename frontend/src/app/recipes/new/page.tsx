import { redirect } from 'next/navigation';

export default function NewRecipeRedirectPage() {
  redirect('/recipes/create');
}
