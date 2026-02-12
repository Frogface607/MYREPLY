'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2, Check, Crown, Zap } from 'lucide-react';
import Link from 'next/link';
import { PLAN_NAMES, PLAN_PRICES, type PlanType } from '@/types';

interface PaywallProps {
  type: 'limit' | 'feature' | 'trial-ended';
  feature?: string;
  usageCount?: number;
  usageLimit?: number;
  trialDaysUsed?: number;
  onClose?: () => void;
  onUpgrade?: (plan: PlanType) => void;
}

export function Paywall({
  type,
  feature,
  usageCount = 0,
  usageLimit = 15,
  trialDaysUsed = 7,
  onClose,
  onUpgrade,
}: PaywallProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'start' }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Ошибка');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка при создании платежа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted hover:text-foreground rounded-lg hover:bg-muted-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Icon */}
        <div className="text-center mb-6">
          {type === 'limit' && (
            <div className="w-16 h-16 bg-warning-light rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">😌</span>
            </div>
          )}
          {type === 'feature' && (
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          )}
          {type === 'trial-ended' && (
            <div className="w-16 h-16 bg-muted-light rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">⏰</span>
            </div>
          )}
        </div>

        {/* Title & Description — emotional copy */}
        <div className="text-center mb-6">
          {type === 'limit' && (
            <>
              <h2 className="text-xl font-semibold mb-3">
                {usageLimit} ответов — готово!
              </h2>
              <p className="text-muted leading-relaxed">
                Помните, как раньше тратили 15 минут на один ответ и нервничали? 
                Теперь это занимает секунды. <strong>Подключите профиль бизнеса</strong> — 
                и ответы будут звучать именно как ваши. Без лимитов.
              </p>
            </>
          )}
          {type === 'feature' && (
            <>
              <h2 className="text-xl font-semibold mb-3">
                {feature || 'Умный профиль'} — ваша суперсила
              </h2>
              <p className="text-muted leading-relaxed">
                AI изучит ваш бизнес и будет генерировать ответы, 
                которые звучат так, будто их написали вы сами. 
                Клиенты почувствуют разницу.
              </p>
            </>
          )}
          {type === 'trial-ended' && (
            <>
              <h2 className="text-xl font-semibold mb-3">
                Пробный период завершён
              </h2>
              <p className="text-muted leading-relaxed">
                За {trialDaysUsed} дней вы сгенерировали {usageCount} ответов. 
                Вы уже знаете, каково это — не нервничать из-за отзывов. 
                <strong> Сохраните это чувство.</strong>
              </p>
            </>
          )}
        </div>

        {/* Plan Card */}
        <div className="bg-primary-light border-2 border-primary rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-semibold">СТАРТ</span>
            </div>
            <div>
              <span className="text-2xl font-bold">{PLAN_PRICES.start / 100} ₽</span>
              <span className="text-muted">/мес</span>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {[
              'Безлимитные ответы',
              'Умный профиль бизнеса',
              'Deep Research — AI изучит вас',
              'Настройка тона общения',
              'Chrome-расширение для WB/Ozon',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Переход к оплате...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Подключить за {PLAN_PRICES.start / 100} ₽/мес
              </>
            )}
          </button>

          <p className="text-xs text-center text-muted mt-2">
            Отмена в любой момент • Возврат 14 дней
          </p>
        </div>

        {/* Links */}
        <div className="text-center space-y-2">
          <Link
            href="/pricing"
            className="text-sm text-primary hover:underline"
          >
            Сравнить все тарифы →
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="block w-full text-sm text-muted hover:text-foreground transition-colors"
            >
              Не сейчас
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Мягкий баннер для upsell (не блокирующий)
interface UpsellBannerProps {
  message?: string;
  onClose?: () => void;
}

export function UpsellBanner({ 
  message = 'С профилем бизнеса ответы звучат так, будто их написали вы сами',
  onClose 
}: UpsellBannerProps) {
  return (
    <div className="bg-primary-light border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-xl">💡</span>
        <p className="text-sm">
          <strong>Совет:</strong> {message}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/pricing"
          className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
        >
          Смотреть тарифы
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Счётчик использования для хедера
interface UsageCounterProps {
  used: number;
  limit: number;
  plan: PlanType;
}

export function UsageCounter({ used, limit, plan }: UsageCounterProps) {
  const isUnlimited = limit >= 999999;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isLow = !isUnlimited && percentage >= 80;
  const isOut = !isUnlimited && used >= limit;

  if (isUnlimited) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-primary-light text-primary">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="font-medium">{PLAN_NAMES[plan]}</span>
      </div>
    );
  }

  return (
    <Link
      href="/pricing"
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
        isOut
          ? 'bg-danger-light text-danger'
          : isLow
          ? 'bg-warning-light text-warning'
          : 'bg-muted-light text-muted hover:text-foreground'
      }`}
    >
      <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isOut ? 'bg-danger' : isLow ? 'bg-warning' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="font-medium whitespace-nowrap">
        {used}/{limit}
      </span>
    </Link>
  );
}
