import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-border mb-4">404</div>
        <h1 className="text-2xl font-semibold mb-3">Страница не найдена</h1>
        <p className="text-muted mb-8">
          Такой страницы не существует. Возможно, она была удалена или вы ошиблись адресом.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            На главную
          </Link>
          <Link
            href="/quick-reply"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted-light text-foreground rounded-xl hover:bg-border transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Quick Reply
          </Link>
        </div>
      </div>
    </div>
  );
}

