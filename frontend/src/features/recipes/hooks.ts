'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '@/lib/services/recipe-service';
import type { GetRecipesParams, CreateRecipeRequest, UpdateRecipeRequest } from '@/lib/types/recipe';

export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (params: GetRecipesParams) => [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (slug: string) => [...recipeKeys.details(), slug] as const,
};

/**
 * Hook fetch danh sách công thức (có phân trang, lọc, sắp xếp)
 */
export function useRecipes(params: GetRecipesParams = {}, enabled = true) {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => recipeService.getRecipes(params),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook fetch chi tiết một công thức theo Slug
 */
export function useRecipeDetail(slug: string, enabled = true) {
  return useQuery({
    queryKey: recipeKeys.detail(slug),
    queryFn: () => recipeService.getRecipeBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook mutation tạo công thức mới (Draft)
 */
export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipeService.createRecipe(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

/**
 * Hook mutation cập nhật công thức
 */
export function useUpdateRecipe(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRecipeRequest) => recipeService.updateRecipe(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

/**
 * Hook mutation xuất bản công thức (Publish)
 */
export function usePublishRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipeService.publishRecipe(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

/**
 * Hook mutation hủy xuất bản công thức (Unpublish)
 */
export function useUnpublishRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipeService.unpublishRecipe(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

/**
 * Hook mutation lưu trữ công thức (Archive)
 */
export function useArchiveRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipeService.archiveRecipe(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

/**
 * Hook mutation xóa mềm công thức (Delete)
 */
export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipeService.deleteRecipe(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}
