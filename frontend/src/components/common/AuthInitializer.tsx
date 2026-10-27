'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/features/auth/hooks';
import { getAccessToken } from '@/features/auth/token-store';
import { refreshApi } from '@/features/auth/api';
import { SESSION_REFRESHED_EVENT } from '@/lib/api-client';
import type { AuthResponse } from '@/features/auth/types';

export default function AuthInitializer() {
  const qc = useQueryClient();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 1. Lắng nghe event session-refreshed từ api-client để đồng bộ React Query cache
    const onSessionRefreshed = (e: Event) => {
      const customEvent = e as CustomEvent<AuthResponse>;
      if (customEvent.detail?.user) {
        qc.setQueryData(authKeys.me, customEvent.detail.user);
      }
    };
    window.addEventListener(SESSION_REFRESHED_EVENT, onSessionRefreshed);

    // 2. Tự động phục hồi session từ HttpOnly Refresh Cookie khi khởi động trang (F5 reload)
    if (!hasInitialized.current && !getAccessToken()) {
      hasInitialized.current = true;
      refreshApi()
        .then((res) => {
          qc.setQueryData(authKeys.me, res.user);
        })
        .catch(() => {
          // Người dùng chưa đăng nhập hoặc cookie hết hạn -> bỏ qua bình thường
        });
    }

    return () => {
      window.removeEventListener(SESSION_REFRESHED_EVENT, onSessionRefreshed);
    };
  }, [qc]);

  return null;
}
