'use client';

import { useState, useEffect } from 'react';
import { ReviewInput } from '@/components/ReviewInput';
import { ResponseCard } from '@/components/ResponseCard';
import { AdjustmentInput } from '@/components/AdjustmentInput';
import { ResponseSkeletonGroup } from '@/components/Skeleton';
import { Paywall, UsageCounter, UpsellBanner } from '@/components/Paywall';
import type { GeneratedResponse, Subscription, PlanType } from '@/types';
import { ArrowLeft, MessageSquareText, Settings, History, Crown, Flame, ToggleLeft, ToggleRight, User } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ReviewAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  mainIssue: string | null;
  urgency: 'low' | 'medium' | 'high';
}

export default function QuickReplyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [responses, setResponses] = useState<GeneratedResponse[]>([]);
  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);
  const [businessSettings, setBusinessSettings] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [includeHardcore, setIncludeHardcore] = useState(false);
  const toast = useToast();

  // Загружаем настройки и подписку
  useEffect(() => {
    const loadData = async () => {
      try {
        // Параллельно загружаем профиль и подписку
        const [profileRes, subRes] = await Promise.all([
          fetch('/api/business'),
          fetch('/api/subscription'),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          if (data.profile) {
            setBusinessSettings(data.profile);
          }
        }

        if (subRes.ok) {
          const data = await subRes.json();
          if (data.subscription) {
            setSubscription(data.subscription);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const checkUsageLimit = (): boolean => {
    // Клиентская проверка лимита (бэкенд /api/generate тоже проверяет и инкрементирует)
    if (subscription && subscription.usage_count >= subscription.usage_limit) {
      setShowPaywall(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (text: string, rating?: number, context?: string, imageBase64?: string) => {
    // Быстрая клиентская проверка лимита (бэкенд тоже проверит)
    if (!checkUsageLimit()) return;

    setIsLoading(true);
    setReviewText(text || '(из скриншота)');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewText: text, 
          rating, 
          context,
          businessSettings,
          imageBase64,
          includeHardcore,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 403 && data.limitReached) {
          setShowPaywall(true);
          return;
        }
        throw new Error(data.error || 'Ошибка генерации');
      }

      const data = await res.json();
      setResponses(data.responses);
      setAnalysis(data.analysis);
      toast.showSuccess('Ответы сгенерированы!');

      // Обновляем локальный счётчик (бэкенд уже инкрементировал)
      if (subscription) {
        setSubscription({
          ...subscription,
          usage_count: subscription.usage_count + 1,
        });
      }

      // Показываем upsell для free пользователей (не всегда)
      if (subscription?.plan === 'free' && !businessSettings && Math.random() > 0.5) {
        setTimeout(() => setShowUpsell(true), 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      toast.showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustment = async (adjustment: string) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText,
          adjustment,
          previousResponses: responses,
          businessSettings,
          includeHardcore,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка генерации');
      }

      const data = await res.json();
      setResponses(data.responses);
      toast.showSuccess('Ответы обновлены');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      toast.showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    const response = responses.find(r => r.text === text);
    const accent = response?.accent;
    
    try {
      await navigator.clipboard.writeText(text);
      
      try {
        const saveRes = await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewText,
            chosenResponse: text,
            responseAccent: accent,
          }),
        });
        
        if (saveRes.ok) {
          toast.showSuccess('Скопировано и сохранено в историю');
        } else {
          toast.showWarning('Скопировано, но не удалось сохранить в историю');
        }
      } catch (error) {
        toast.showWarning('Скопировано, но не удалось сохранить в историю');
        console.error('Error saving to history:', error);
      }
    } catch (error) {
      toast.showError('Не удалось скопировать текст');
      console.error('Error copying text:', error);
    }
  };

  const handleFeedback = async (responseId: string, feedback: 'liked' | 'disliked') => {
    console.log('Feedback:', responseId, feedback);
  };

  const handleRegenerate = async (responseId: string) => {
    const response = responses.find(r => r.id === responseId);
    if (!response) return;
    await handleAdjustment(`Перегенерируй ${response.accent} вариант, сделай его другим`);
  };

  const sentimentLabels = {
    positive: { label: 'Позитивный', color: 'bg-success-light text-success' },
    neutral: { label: 'Нейтральный', color: 'bg-muted-light text-muted' },
    negative: { label: 'Негативный', color: 'bg-danger-light text-danger' },
  };

  const urgencyLabels = {
    low: { label: 'Низкая', color: 'text-muted' },
    medium: { label: 'Средняя', color: 'text-warning' },
    high: { label: 'Высокая', color: 'text-danger' },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Главная</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <MessageSquareText className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Usage Counter */}
            {subscription && (
              <UsageCounter
                used={subscription.usage_count}
                limit={subscription.usage_limit}
                plan={subscription.plan as PlanType}
              />
            )}
            <Link
              href="/history"
              className="flex items-center gap-1 text-muted hover:text-foreground transition-colors"
              title="История"
            >
              <History className="w-5 h-5" />
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-1 text-muted hover:text-foreground transition-colors"
              title="Настройки"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-muted hover:text-foreground transition-colors"
              title="Кабинет"
            >
              <User className="w-5 h-5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Trial Banner */}
        {subscription?.status === 'trialing' && (
          <div className="mb-6 p-4 bg-primary-light border border-primary/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <p className="text-sm">
                <strong>Пробный период:</strong> У вас полный доступ ещё{' '}
                {subscription.trial_end 
                  ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : 7
                } дней
              </p>
            </div>
            <Link href="/pricing" className="text-sm text-primary font-medium hover:underline">
              Тарифы
            </Link>
          </div>
        )}

        {/* Demo Banner (only for free without profile) */}
        {!businessSettings && subscription?.plan === 'free' && subscription?.status !== 'trialing' && (
          <div className="mb-6 p-4 bg-muted-light border border-border rounded-xl">
            <p className="text-sm">
              <strong>Demo режим:</strong> Настройте профиль бизнеса в{' '}
              <Link href="/settings" className="text-primary underline">Настройках</Link>
              {' '}для более точных ответов.
            </p>
          </div>
        )}

        {/* Upsell Banner */}
        {showUpsell && (
          <div className="mb-6">
            <UpsellBanner
              message="С профилем бизнеса ответы становятся персональными и попадают в точку"
              onClose={() => setShowUpsell(false)}
            />
          </div>
        )}

        {/* Mode Toggle */}
        <div className="mb-4 flex items-center justify-end">
          <button
            onClick={() => setIncludeHardcore(!includeHardcore)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              includeHardcore 
                ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                : 'bg-muted-light text-muted hover:bg-muted-light/80'
            }`}
          >
            <Flame className={`w-4 h-4 ${includeHardcore ? 'text-orange-500' : ''}`} />
            <span>{includeHardcore ? 'Все режимы + Дерзкий' : '4 рабочих режима'}</span>
            {includeHardcore ? (
              <ToggleRight className="w-5 h-5 text-orange-500" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Input Section */}
        <section className="mb-8">
          <ReviewInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </section>

        {/* Loading Skeleton */}
        {isLoading && responses.length === 0 && (
          <section className="mb-8">
            <ResponseSkeletonGroup />
          </section>
        )}

        {/* Results Section */}
        {responses.length > 0 && (
          <section className="animate-fade-in">
            {/* Analysis */}
            {analysis && (
              <div className="bg-card border border-border rounded-xl p-4 mb-6">
                <h3 className="text-sm font-medium mb-3">Анализ отзыва</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Тональность:</span>
                    <span className={`px-2 py-0.5 rounded-full ${sentimentLabels[analysis.sentiment].color}`}>
                      {sentimentLabels[analysis.sentiment].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Срочность:</span>
                    <span className={urgencyLabels[analysis.urgency].color}>
                      {urgencyLabels[analysis.urgency].label}
                    </span>
                  </div>
                  {analysis.mainIssue && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Проблема:</span>
                      <span>{analysis.mainIssue}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Response Cards */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              {responses.map((response, index) => (
                <div 
                  key={response.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ResponseCard
                    response={response}
                    onCopy={handleCopy}
                    onFeedback={handleFeedback}
                    onRegenerate={handleRegenerate}
                  />
                </div>
              ))}
            </div>

            {/* Adjustment */}
            <div className="mt-6">
              <AdjustmentInput
                onAdjust={handleAdjustment}
                isLoading={isLoading}
              />
            </div>

            {/* New Review Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setResponses([]);
                  setAnalysis(null);
                  setReviewText('');
                }}
                className="text-primary hover:text-primary-hover font-medium"
              >
                ← Обработать другой отзыв
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Paywall Modal */}
      {showPaywall && (
        <Paywall
          type="limit"
          usageCount={subscription?.usage_count}
          usageLimit={subscription?.usage_limit}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  );
}
