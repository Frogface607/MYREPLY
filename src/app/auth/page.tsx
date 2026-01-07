'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setIsSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-semibold mb-3">Проверьте почту</h1>
            <p className="text-muted mb-6">
              Мы отправили ссылку для входа на<br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted">
              Не пришло письмо? Проверьте папку «Спам» или{' '}
              <button
                onClick={() => setIsSent(false)}
                className="text-primary hover:underline"
              >
                попробуйте снова
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Вход в MyReply</h1>
            <p className="text-muted">
              Введите email — пришлём волшебную ссылку
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-danger-light text-danger rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Отправляем...
                </>
              ) : (
                'Получить ссылку для входа'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Нажимая кнопку, вы соглашаетесь с{' '}
            <a href="#" className="text-primary hover:underline">
              условиями использования
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

