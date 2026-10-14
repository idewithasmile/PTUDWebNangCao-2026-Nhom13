'use client';

import { useEffect, useState } from 'react';
import type { RecipeStepDto } from '@/lib/types/recipe';
import { ChefHat, Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface RecipeStepsListProps {
  steps: RecipeStepDto[];
  instructions?: string;
}

function StepTimer({ minutes }: { minutes: number }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50/80 p-3 text-xs text-orange-900">
      <Clock className="h-4 w-4 text-orange-600 animate-pulse" />
      <span className="font-medium">
        Đồng hồ bấm giờ: {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleTimer}
          className="inline-flex items-center gap-1 rounded-lg bg-orange-600 px-2.5 py-1 text-white hover:bg-orange-700"
        >
          {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isRunning ? 'Tạm dừng' : 'Bắt đầu'}</span>
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="rounded-lg border border-orange-200 bg-white p-1 text-orange-700 hover:bg-orange-100"
          title="Đặt lại đồng hồ"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function RecipeStepsList({ steps, instructions }: RecipeStepsListProps) {
  const sortedSteps = steps ? [...steps].sort((a, b) => a.stepNumber - b.stepNumber) : [];

  return (
    <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
        <ChefHat className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg">Các bước thực hiện</h3>
      </div>

      {/* Hướng dẫn tổng quan (nếu có) */}
      {instructions && (
        <div className="rounded-xl bg-amber-50/60 p-4 text-sm text-amber-900 border border-amber-100">
          <h4 className="font-semibold mb-1 text-amber-950">Lưu ý chung của tác giả:</h4>
          <p className="whitespace-pre-line leading-relaxed">{instructions}</p>
        </div>
      )}

      {/* Danh sách các bước chi tiết */}
      {sortedSteps.length > 0 ? (
        <div className="space-y-6">
          {sortedSteps.map((step, idx) => (
            <div key={step.id || idx} className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white shadow-sm">
                {step.stepNumber || idx + 1}
              </div>

              <div className="flex-1 space-y-2 pt-0.5">
                {step.title && (
                  <h4 className="text-base font-bold text-gray-900">{step.title}</h4>
                )}
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                  {step.description}
                </p>

                {/* Đồng hồ hẹn giờ cho bước nấu này (nếu có) */}
                {step.timerMinutes && step.timerMinutes > 0 && (
                  <StepTimer minutes={step.timerMinutes} />
                )}

                {/* Ảnh minh họa của bước (nếu có) */}
                {step.imageUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 max-w-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.imageUrl}
                      alt={`Bước ${step.stepNumber}: ${step.title || 'Hình minh họa'}`}
                      className="w-full object-cover max-h-64"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Chưa có các bước chi tiết được nhập cho công thức này.
        </p>
      )}
    </div>
  );
}
