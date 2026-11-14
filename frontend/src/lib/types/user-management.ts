export interface UserSummaryDto {
  id: string;
  userName: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  totalRecipes: number;
  publishedRecipes: number;
}

export interface UserStatsSummaryDto {
  totalUsers: number;
  totalAdmins: number;
  totalAuthors: number;
  totalActive: number;
}

export interface PagedUsersResultDto {
  items: UserSummaryDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  stats: UserStatsSummaryDto;
}

export interface GetUsersParams {
  searchTerm?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}
