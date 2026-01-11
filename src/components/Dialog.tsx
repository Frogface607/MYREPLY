'use client';

import { useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'default';
}

export function Dialog({
  open,
  onClose,
  title,
  message,
  type = 'confirm',
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
  variant = 'default',
}: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleCancel();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'alert':
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      default:
        return variant === 'danger' 
          ? <AlertTriangle className="w-6 h-6 text-danger" />
          : <Info className="w-6 h-6 text-primary" />;
    }
  };

  const getConfirmButtonClass = () => {
    if (variant === 'danger') {
      return 'bg-danger text-white hover:bg-danger/90';
    }
    if (type === 'success') {
      return 'bg-success text-white hover:bg-success/90';
    }
    return 'bg-primary text-white hover:bg-primary-hover';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          {getIcon()}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-3">{title}</h2>

        {/* Message */}
        <p className="text-muted text-center mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl hover:bg-muted-light transition-colors font-medium"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl transition-colors font-medium ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1 text-muted hover:text-foreground transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

