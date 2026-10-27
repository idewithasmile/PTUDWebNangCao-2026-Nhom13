'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '@/lib/services/recipe-service';
import type {
  GetRecipesParams,
  SearchRecipesParams,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  AddIngredientRequest,
  UpdateIngredientRequest,
  AddStepRequest,
  UpdateStepRequest,
} from '@/lib/types/recipe';

export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (params: GetRecipesParams) => [...recipeKeys.lists(), params] as const,
  search: (params: SearchRecipesParams) => [...recipeKeys.all, 'search', params] as const,
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
 * Hook tìm kiếm công thức bằng PostgreSQL Full-Text Search (FR-SRCH-001)
 */
export function useSearchRecipes(params: SearchRecipesParams, enabled = true) {
  return useQuery({
    queryKey: recipeKeys.search(params),
    queryFn: () => recipeService.searchRecipes(params),
    enabled: enabled && !!params.searchTerm?.trim(),
    staleTime: 2 * 60 * 1000,
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

// ---------------------------------------------------------------------------
// FR-RCP-008: Hooks quản lý Thư viện ảnh (Images Gallery & Primary Image)
// ---------------------------------------------------------------------------

export function useUploadRecipeImage(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      recipeService.uploadRecipeImage(recipeId, file, altText),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export function useSetPrimaryRecipeImage(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => recipeService.setPrimaryImage(recipeId, imageId),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export function useDeleteRecipeImage(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => recipeService.deleteRecipeImage(recipeId, imageId),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

// ---------------------------------------------------------------------------
// FR-RCP-009: Hooks quản lý Nguyên liệu (Ingredients CRUD độc lập)
// ---------------------------------------------------------------------------

export function useAddRecipeIngredient(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddIngredientRequest) =>
      recipeService.addRecipeIngredient(recipeId, data),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export const useAddIngredient = useAddRecipeIngredient;

export function useUpdateRecipeIngredient(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ingredientId,
      data,
    }: {
      ingredientId: string;
      data: UpdateIngredientRequest;
    }) => recipeService.updateRecipeIngredient(recipeId, ingredientId, data),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export const useUpdateIngredient = useUpdateRecipeIngredient;

export function useDeleteRecipeIngredient(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ingredientId: string) =>
      recipeService.deleteRecipeIngredient(recipeId, ingredientId),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export const useDeleteIngredient = useDeleteRecipeIngredient;

// ---------------------------------------------------------------------------
// FR-RCP-010: Hooks quản lý Các bước thực hiện (Steps CRUD độc lập)
// ---------------------------------------------------------------------------

export function useAddRecipeStep(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddStepRequest) =>
      recipeService.addRecipeStep(recipeId, data),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export const useAddStep = useAddRecipeStep;

export function useUpdateRecipeStep(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      stepId,
      data,
    }: {
      stepId: string;
      data: UpdateStepRequest;
    }) => recipeService.updateRecipeStep(recipeId, stepId, data),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export const useUpdateStep = useUpdateRecipeStep;

export function useDeleteRecipeStep(recipeId: string, slug?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stepId: string) => recipeService.deleteRecipeStep(recipeId, stepId),
    onSuccess: () => {
      if (slug) qc.invalidateQueries({ queryKey: recipeKeys.detail(slug) });
      qc.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export const useDeleteStep = useDeleteRecipeStep;
