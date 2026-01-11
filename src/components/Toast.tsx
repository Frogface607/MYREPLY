'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastConfig: Record<ToastType, { icon: React.ReactNode; bgColor: string; textColor: string; iconColor: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bgColor: 'bg-success',
    textColor: 'text-white',
    iconColor: 'text-white',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bgColor: 'bg-danger',
    textColor: 'text-white',
    iconColor: 'text-white',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bgColor: 'bg-primary',
    textColor: 'text-white',
    iconColor: 'text-white',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-warning',
    textColor: 'text-white',
    iconColor: 'text-white',
  },
};

export function ToastItem({ toast, onClose }: ToastProps) {
  const config = toastConfig[toast.type];
  const duration = toast.duration ?? 3000;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, toast.id, onClose]);

  return (
    <div
      className={`${config.bgColor} ${config.textColor} px-4 py-3 rounded-xl shadow-lg flex items-start gap-3 min-w-[320px] max-w-md animate-slide-up`}
      role="alert"
    >
      <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
        {config.icon}
      </div>
      <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Закрыть"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

