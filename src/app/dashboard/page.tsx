'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageSquareText, 
  History, 
  Settings, 
  LogOut, 
  Sparkles,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import type { Business, ResponseHistory } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [recentHistory, setRecentHistory] = useState<ResponseHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }
        setUserEmail(user.email || '');

        // Загружаем бизнес
        const { data: businessData } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!businessData) {
          router.push('/onboarding');
          return;
        }
        
        setBusiness(businessData as Business);

        // Загружаем последние ответы
        const { data: historyData } = await supabase
          .from('response_history')
          .select('*')
          .eq('business_id', businessData.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentHistory(historyData as ResponseHistory[] || []);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    total: recentHistory.length,
    today: recentHistory.filter(h => {
      const today = new Date().toDateString();
      return new Date(h.created_at).toDateString() === today;
    }).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">MyReply</h1>
              <p className="text-sm text-muted">{business?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Добро пожаловать! 👋
          </h2>
          <p className="text-muted">
            Готовы отвечать на отзывы без стресса?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link
            href="/quick-reply"
            className="group bg-primary text-white rounded-2xl p-6 hover:bg-primary-hover transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquareText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Quick Reply</h3>
                <p className="text-white/80 text-sm">Получить ответы на отзыв</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">
              Вставьте текст отзыва → получите 3 готовых варианта ответа
            </p>
          </Link>

          <Link
            href="/history"
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-muted-light rounded-xl flex items-center justify-center">
                <History className="w-6 h-6 text-muted" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">История</h3>
                <p className="text-muted text-sm">Все ваши ответы</p>
              </div>
            </div>
            <p className="text-muted text-sm">
              Посмотрите историю сгенерированных ответов
            </p>
          </Link>

          <Link
            href="/settings"
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-muted-light rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-muted" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Настройки</h3>
                <p className="text-muted text-sm">Тон и правила</p>
              </div>
            </div>
            <p className="text-muted text-sm">
              Измените стиль ответов и правила бизнеса
            </p>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm text-muted">Всего ответов</span>
            </div>
            <p className="text-3xl font-semibold">{stats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted">Сегодня</span>
            </div>
            <p className="text-3xl font-semibold">{stats.today}</p>
          </div>
        </div>

        {/* Recent Activity */}
        {recentHistory.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Последние ответы</h3>
            <div className="space-y-4">
              {recentHistory.slice(0, 3).map((item) => (
                <div key={item.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="text-sm text-muted mb-1 line-clamp-1">
                    Отзыв: {item.review_text}
                  </p>
                  <p className="text-sm line-clamp-2">
                    {item.chosen_response}
                  </p>
                  <p className="text-xs text-muted mt-2">
                    {new Date(item.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
            {recentHistory.length > 3 && (
              <Link 
                href="/history" 
                className="block text-center text-primary text-sm mt-4 hover:underline"
              >
                Показать все →
              </Link>
            )}
          </div>
        )}

        {/* Empty state */}
        {recentHistory.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-muted-light rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareText className="w-8 h-8 text-muted" />
            </div>
            <h3 className="font-semibold mb-2">Пока нет ответов</h3>
            <p className="text-muted mb-4">
              Перейдите в Quick Reply, чтобы обработать первый отзыв
            </p>
            <Link
              href="/quick-reply"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Начать
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

