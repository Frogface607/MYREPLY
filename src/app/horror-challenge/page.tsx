'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  ArrowRight,
  Check,
  Copy,
  Skull,
  Gift,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const businessTypes = [
  { value: 'cafe', label: 'Кафе / Бар' },
  { value: 'restaurant', label: 'Ресторан' },
  { value: 'delivery', label: 'Доставка еды' },
  { value: 'beauty', label: 'Салон красоты' },
  { value: 'shop', label: 'Магазин / Маркетплейс' },
  { value: 'hotel', label: 'Отель / Гостиница' },
  { value: 'service', label: 'Сервис / Услуги' },
  { value: 'other', label: 'Другое' },
];

export default function HorrorChallengePage() {
  const [reviewText, setReviewText] = useState('');
  const [businessType, setBusinessType] = useState('cafe');
  const [email, setEmail] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ promo_code: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/horror/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_text: reviewText,
          business_type: businessType,
          submitter_email: email,
          author_name: authorName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка отправки');

      setResult({ promo_code: data.promo_code, message: data.message });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const copyPromo = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.promo_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Logo className="h-7 sm:h-8 w-auto" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/horror-wall"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors hidden sm:block"
            >
              Стена ужасов
            </Link>
            <ThemeToggle />
            <Link
              href="/auth"
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all"
            >
              Войти
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-danger-light/40 border border-danger/30 text-danger rounded-full text-sm font-medium mb-6">
            <Flame className="w-4 h-4" />
            <span>Horror Reviews Challenge</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-[1.1]">
            Расскажи свой{' '}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              самый адовый отзыв
            </span>
            <br />— получи неделю MyReply PRO бесплатно
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto mb-6 leading-relaxed">
            Хамят, шантажируют, пишут бред? Пришли нам — мы обезличим,
            покажем публике и сгенерим дерзкий ответ от AI.
            Тебе — промокод на PRO. Бесплатно. Без карты.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-primary" />
              7 дней PRO бесплатно
            </span>
            <span className="flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-primary" />
              Обезличим полностью
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              AI дерзкий ответ в подарок
            </span>
          </div>
        </div>

        {/* Result state */}
        {result ? (
          <div className="bg-card border border-success/40 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Принято! Твой промокод:</h2>

            <button
              onClick={copyPromo}
              className="group inline-flex items-center gap-3 px-6 py-4 bg-primary/5 border-2 border-dashed border-primary rounded-2xl hover:bg-primary/10 transition-all mb-4"
            >
              <code className="text-2xl font-mono font-bold text-primary tracking-wider">
                {result.promo_code}
              </code>
              {copied ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Copy className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              )}
            </button>

            <p className="text-muted mb-6 max-w-md mx-auto leading-relaxed">
              {result.message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all"
              >
                Зарегистрироваться и активировать
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/horror-wall"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all"
              >
                Посмотреть стену ужасов
              </Link>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Текст отзыва <span className="text-danger">*</span>
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Вставь сюда отзыв как есть. Мы обезличим все имена, локации и контакты."
                rows={7}
                maxLength={3000}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-xs text-muted mt-1">
                {reviewText.length}/3000 · минимум 20 символов
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Тип бизнеса <span className="text-danger">*</span>
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                >
                  {businessTypes.map((bt) => (
                    <option key={bt.value} value={bt.value}>
                      {bt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Твоё имя (необязательно)
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Сергей"
                  maxLength={50}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email для промокода <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted mt-1">
                Промокод покажем сразу после отправки. На email продублируем.
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 bg-danger-light/30 border border-danger/40 rounded-xl text-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || reviewText.trim().length < 20 || !email}
              className="w-full group px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Отправляем...
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  Прислать и получить промокод
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted">
              Отправляя, ты соглашаешься на публикацию отзыва в{' '}
              <Link href="/horror-wall" className="text-primary hover:underline">
                обезличенной форме
              </Link>
              . Никаких имён, телефонов, адресов.
            </p>
          </form>
        )}

        {/* Link to wall */}
        {!result && (
          <div className="mt-12 text-center">
            <Link
              href="/horror-wall"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium"
            >
              Посмотреть адовые отзывы от других
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
