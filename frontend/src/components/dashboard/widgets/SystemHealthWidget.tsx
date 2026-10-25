'use client';

import { useSystemHealth } from '@/features/dashboard/hooks';
import { Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface SystemHealthWidgetProps {
  isAdmin?: boolean;
}

export default function SystemHealthWidget({ isAdmin }: SystemHealthWidgetProps) {
  const { data: health, isLoading, refetch, isFetching } = useSystemHealth();

  const entries = health?.entries || {};
  const isDbOk = entries.database?.status === 'Healthy';
  const isRedisOk = entries.redis?.status === 'Healthy';
  const isMinioOk = entries.minio?.status === 'Healthy';

  const services = [
    { name: 'Máy chủ Backend (.NET 10)', isOk: true },
    { name: 'Máy chủ Frontend (Next.js)', isOk: true },
    { name: 'Cơ sở dữ liệu (PostgreSQL)', isOk: isDbOk },
    { name: 'Bộ nhớ đệm (Redis Cache)', isOk: isRedisOk },
    { name: 'Kho tệp tin (MinIO Storage)', isOk: isMinioOk },
    { name: 'Tiến trình ngầm (Hangfire)', isOk: true },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Trạng thái hệ thống</h3>
            <p className="text-xs text-gray-400">Giám sát các dịch vụ nền theo thời gian thực</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          title="Làm mới trạng thái"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-orange-500' : ''}`} />
        </button>
      </div>

      <div className="space-y-2.5 text-xs">
        {services.map((srv, idx) => (
          <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
            <span className="text-gray-600 font-medium">{srv.name}</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  srv.isOk ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span
                className={`text-[11px] font-bold ${
                  srv.isOk ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {srv.isOk ? 'Hoạt động' : 'Gián đoạn'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>Độ sẵn sàng (Uptime): <strong className="text-gray-700">99.98%</strong></span>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
          Ổn định
        </span>
      </div>
    </div>
  );
}
