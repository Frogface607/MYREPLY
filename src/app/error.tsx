'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-danger-light rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-danger" />
        </div>
        <h1 className="text-2xl font-semibold mb-3">Что-то пошло не так</h1>
        <p className="text-muted mb-8">
          Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Попробовать снова
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted-light text-foreground rounded-xl hover:bg-border transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            На главную
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="text-sm text-muted cursor-pointer hover:text-foreground">
              Техническая информация
            </summary>
            <pre className="mt-2 p-4 bg-muted-light rounded-lg text-xs overflow-auto max-h-40">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

