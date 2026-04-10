'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Flame, ArrowRight, MessageSquareText, Skull, Loader2 } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HorrorItem {
  id: string;
  review_text: string;
  business_type: string | null;
  business_name_anon: string | null;
  ai_response: string | null;
  likes: number;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  cafe: 'Кафе',
  restaurant: 'Ресторан',
  delivery: 'Доставка',
  beauty: 'Салон красоты',
  shop: 'Магазин',
  hotel: 'Отель',
  service: 'Сервис',
  other: 'Бизнес',
};

export default function HorrorWallPage() {
  const [items, setItems] = useState<HorrorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState<Record<string, boolean>>({});
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/horror/list?limit=30')
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (id: string) => {
    if (likedIds.has(id) || liking[id]) return;
    setLiking((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/horror/like/${id}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, likes: data.likes } : it)));
        setLikedIds((s) => new Set(s).add(id));
      }
    } catch {
      // silent
    } finally {
      setLiking((s) => ({ ...s, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Logo className="h-7 sm:h-8 w-auto" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/horror-challenge"
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors hidden sm:block"
            >
              Прислать свой
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

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-danger-light/40 border border-danger/30 text-danger rounded-full text-sm font-medium mb-6">
            <Skull className="w-4 h-4" />
            <span>Стена ужасов</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-[1.1]">
            Самые{' '}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              адовые отзывы
            </span>
            <br />от российских бизнесов
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-6 leading-relaxed">
            Реальные отзывы. Обезличенные. С дерзкими AI-ответами от MyReply.
            Голосуй за самый адовый.
          </p>
          <Link
            href="/horror-challenge"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/25"
          >
            <Flame className="w-4 h-4" />
            Добавь свой — получи PRO
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Skull className="w-12 h-12 mx-auto mb-4 text-muted" />
            <h3 className="text-xl font-semibold mb-2">Пока пусто</h3>
            <p className="text-muted mb-6">
              Отзывы появятся в течение 24 часов после модерации. Будь первым!
            </p>
            <Link
              href="/horror-challenge"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all"
            >
              Прислать отзыв
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => {
              const liked = likedIds.has(item.id);
              return (
                <article
                  key={item.id}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors flex flex-col"
                >
                  {/* Meta */}
                  <div className="flex items-center justify-between mb-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background rounded-full border border-border">
                      <Flame className="w-3 h-3 text-danger" />
                      {item.business_name_anon ||
                        typeLabels[item.business_type || 'other'] ||
                        'Бизнес'}
                    </span>
                    <time>{new Date(item.created_at).toLocaleDateString('ru-RU')}</time>
                  </div>

                  {/* Review */}
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wide text-danger font-semibold mb-2 flex items-center gap-1">
                      <Skull className="w-3 h-3" />
                      Отзыв
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {item.review_text}
                    </p>
                  </div>

                  {/* AI Response */}
                  {item.ai_response && (
                    <div className="bg-primary-light/30 border border-primary/20 rounded-xl p-4 mb-4">
                      <div className="text-xs uppercase tracking-wide text-primary font-semibold mb-2 flex items-center gap-1">
                        <MessageSquareText className="w-3 h-3" />
                        Ответ от MyReply AI
                      </div>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {item.ai_response}
                      </p>
                    </div>
                  )}

                  {/* Like */}
                  <div className="mt-auto pt-3 border-t border-border/50">
                    <button
                      onClick={() => handleLike(item.id)}
                      disabled={liked || liking[item.id]}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        liked
                          ? 'bg-danger/10 text-danger cursor-default'
                          : 'bg-background hover:bg-danger/10 hover:text-danger border border-border'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-danger' : ''}`} />
                      {item.likes}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
