export interface CategoryDistributionDto {
  categoryId: string;
  name: string;
  recipeCount: number;
  percentage: number;
}

export interface DailyActivityDto {
  date: string;
  recipeCount: number;
}

export interface DashboardStatsDto {
  totalRecipes: number;
  publishedRecipes: number;
  draftRecipes: number;
  archivedRecipes: number;
  totalAuthors: number | null;
  categoryDistribution: CategoryDistributionDto[];
  activity7Days: DailyActivityDto[];
  isSystemScope: boolean;
}

export interface RecentFileDto {
  id: string;
  fileName: string;
  originalUrl: string;
  thumbnailUrl: string | null;
  isPrimary: boolean;
  createdAt: string;
  recipeId: string;
  recipeTitle: string;
}

export interface HealthCheckEntry {
  status: 'Healthy' | 'Unhealthy' | 'Degraded';
  description: string | null;
  duration: string;
}

export interface SystemHealthDto {
  status: 'Healthy' | 'Unhealthy' | 'Degraded';
  entries: {
    database?: HealthCheckEntry;
    redis?: HealthCheckEntry;
    minio?: HealthCheckEntry;
  };
}
