'use client';

import * as React from 'react';
import { X, AlertTriangle, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export function Dialog({
  isOpen,
  onClose,
  children,
  className,
  ariaLabelledBy = 'dialog-title',
  ariaDescribedBy = 'dialog-description',
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape key press
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while dialog is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-scale-up',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  children,
  onClose,
}: {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-gray-100',
        className
      )}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng hộp thoại"
          className="rounded-xl p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function DialogTitle({
  id = 'dialog-title',
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className={cn('text-base font-bold text-gray-900 truncate', className)}
    >
      {children}
    </h3>
  );
}

export function DialogDescription({
  id = 'dialog-description',
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} className={cn('text-xs text-gray-500 mt-0.5', className)}>
      {children}
    </p>
  );
}

export function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('p-6 space-y-4', className)}>{children}</div>;
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  isOpen,
  title,
  subtitle,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy bỏ',
  variant = 'warning',
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const getIconAndStyle = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          headerBg: 'bg-rose-50/50',
          iconBg: 'bg-rose-100 text-rose-600',
          confirmBtnVariant: 'destructive' as const,
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          headerBg: 'bg-emerald-50/50',
          iconBg: 'bg-emerald-100 text-emerald-600',
          confirmBtnVariant: 'default' as const,
        };
      case 'info':
        return {
          icon: <Info className="w-5 h-5" />,
          headerBg: 'bg-blue-50/50',
          iconBg: 'bg-blue-100 text-blue-600',
          confirmBtnVariant: 'default' as const,
        };
      case 'warning':
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          headerBg: 'bg-amber-50/50',
          iconBg: 'bg-amber-100 text-amber-600',
          confirmBtnVariant: 'default' as const,
        };
    }
  };

  const { icon, headerBg, iconBg, confirmBtnVariant } = getIconAndStyle();

  return (
    <Dialog isOpen={isOpen} onClose={isLoading ? () => {} : onClose}>
      <DialogHeader className={headerBg} onClose={isLoading ? undefined : onClose}>
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl shrink-0', iconBg)}>{icon}</div>
          <div>
            <DialogTitle>{title}</DialogTitle>
            {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
          </div>
        </div>
      </DialogHeader>

      <DialogContent>
        <div className="text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
          {description}
        </div>
      </DialogContent>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={onClose}
          className="rounded-xl text-xs"
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={confirmBtnVariant}
          size="sm"
          disabled={isLoading}
          onClick={onConfirm}
          className={cn(
            'rounded-xl text-xs font-semibold',
            variant === 'success' && 'bg-emerald-600 hover:bg-emerald-700 text-white',
            variant === 'info' && 'bg-blue-600 hover:bg-blue-700 text-white',
            variant === 'warning' && 'bg-amber-600 hover:bg-amber-700 text-white'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
