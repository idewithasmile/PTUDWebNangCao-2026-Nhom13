import { apiClient, getApiBaseUrl } from '@/lib/api-client';
import { authHeaders } from '@/features/auth/token-store';

export interface SubscribeNewsletterPayload {
  email: string;
  customerName?: string;
  favoriteCategorySlug?: string;
  source?: string;
}

export interface NewsletterSubscribeResult {
  id: string;
  email: string;
  customerName: string | null;
  favoriteCategorySlug: string | null;
  source: string;
  isActive: boolean;
  isResubscribed: boolean;
  subscribedAt: string;
  message: string;
}

export interface NewsletterSubscriberDto {
  id: string;
  email: string;
  customerName: string | null;
  favoriteCategorySlug: string | null;
  source: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export interface NewsletterSubscribersListDto {
  items: NewsletterSubscriberDto[];
  totalCount: number;
  activeCount: number;
  unsubscribedCount: number;
  page: number;
  pageSize: number;
}

function withAuth(init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      ...authHeaders(),
      ...init.headers,
    },
  };
}

export const newsletterService = {
  async subscribe(payload: SubscribeNewsletterPayload): Promise<NewsletterSubscribeResult> {
    return apiClient<NewsletterSubscribeResult>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async unsubscribe(token: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  async getSubscribers(params: {
    search?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  } = {}): Promise<NewsletterSubscribersListDto> {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.isActive !== undefined) qs.set('isActive', String(params.isActive));
    qs.set('page', String(params.page ?? 1));
    qs.set('pageSize', String(params.pageSize ?? 15));

    return apiClient<NewsletterSubscribersListDto>(`/newsletter/subscribers?${qs.toString()}`, withAuth());
  },

  async deleteSubscriber(id: string): Promise<void> {
    return apiClient<void>(`/newsletter/subscribers/${id}`, withAuth({ method: 'DELETE' }));
  },

  async exportCsv(isActive?: boolean): Promise<Blob> {
    const qs = new URLSearchParams();
    if (isActive !== undefined) qs.set('isActive', String(isActive));
    const queryString = qs.toString();
    const url = `${getApiBaseUrl()}/newsletter/subscribers/export${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        ...authHeaders(),
      },
    });

    if (!res.ok) {
      throw new Error('Không thể xuất danh sách CSV.');
    }

    return res.blob();
  },
};
