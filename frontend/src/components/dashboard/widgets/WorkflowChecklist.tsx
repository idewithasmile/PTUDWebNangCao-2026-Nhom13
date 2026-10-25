'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  deadline: string;
  isCompleted: boolean;
}

export default function WorkflowChecklist() {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: '1',
      title: 'Viết bài: Cách làm bánh mì bơ tỏi',
      priority: 'Cao',
      deadline: '16/09/2026 20:00',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Chỉnh sửa hình ảnh món phở bò',
      priority: 'Trung bình',
      deadline: '17/09/2026 10:00',
      isCompleted: true,
    },
    {
      id: '3',
      title: 'Lên lịch đăng bài tuần sau',
      priority: 'Trung bình',
      deadline: '18/09/2026 09:00',
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Phê duyệt bình luận (12 mới)',
      priority: 'Thấp',
      deadline: '16/09/2026 15:30',
      isCompleted: true,
    },
    {
      id: '5',
      title: 'Backup cơ sở dữ liệu',
      priority: 'Thấp',
      deadline: '17/09/2026 02:00',
      isCompleted: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'completed') return t.isCompleted;
    if (activeTab === 'pending') return !t.isCompleted;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900">Công việc & Lịch trình</h3>
          <button
            type="button"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-xl bg-gray-100 p-0.5 text-xs font-semibold mb-4 w-full justify-between">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1 text-center rounded-lg transition ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-2xs font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Tất cả ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-1 text-center rounded-lg transition ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white shadow-2xs font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Đã hoàn thành ({completedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-1 text-center rounded-lg transition ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white shadow-2xs font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Chưa hoàn thành ({pendingCount})
          </button>
        </div>

        {/* List */}
        <div className="space-y-3 text-xs">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 pointer-events-none"
                />
                <span
                  className={`truncate font-medium transition ${
                    task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    task.priority === 'Cao'
                      ? 'bg-rose-50 text-rose-600'
                      : task.priority === 'Trung bình'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {task.priority}
                </span>

                <span className="text-gray-400 text-[11px] font-medium">
                  {task.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
