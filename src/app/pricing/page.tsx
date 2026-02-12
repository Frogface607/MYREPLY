'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, Loader2, Crown } from 'lucide-react';
import { PLAN_LIMITS, PLAN_PRICES, PLAN_NAMES, type PlanType, type Subscription } from '@/types';

const plans: {
  id: PlanType;
  name: string;
  price: number;
  period: string;
  description: string;
  pricePerReply?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '',
    description: 'Попробовать и оценить',
    features: [
      '10 ответов в месяц',
      'Все режимы ответов',
      'Загрузка скриншотов',
      'Базовая генерация',
    ],
  },
  {
    id: 'start',
    name: 'Старт',
    price: 490,
    period: '/мес',
    description: 'Для небольшого бизнеса',
    pricePerReply: '~5 ₽ за ответ',
    features: [
      '100 ответов в месяц',
      'Умный профиль бизнеса',
      'Deep Research — AI изучит вас',
      'Настройка тона общения',
      'История всех ответов',
      'Приоритетная генерация',
    ],
    highlighted: true,
    badge: 'Популярный',
  },
  {
    id: 'pro',
    name: 'Про',
    price: 990,
    period: '/мес',
    description: 'Для активного бизнеса',
    pricePerReply: '~2 ₽ за ответ',
    features: [
      '500 ответов в месяц',
      'Всё из тарифа Старт',
      'Шаблоны быстрых ответов',
      'Экспорт истории',
      'Приоритетная поддержка',
    ],
  },
  {
    id: 'business',
    name: 'Бизнес',
    price: 2490,
    period: '/мес',
    description: 'Для команд и сетей',
    features: [
      'Безлимитные ответы',
      'Всё из тарифа Про',
      'До 3 пользователей',
      'API доступ',
      'Выделенная поддержка',
      'Оплата по счёту',
    ],
  },
];

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const res = await fetch('/api/subscription');
        if (res.ok) {
          const data = await res.json();
          if (data.subscription) {
            setCurrentPlan(data.subscription.plan);
          }
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const handleSelectPlan = async (planId: PlanType) => {
    if (planId === 'free' || planId === currentPlan) return;

    setProcessingPlan(planId);
    
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        // Редирект на страницу оплаты ЮKassa
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Ошибка создания платежа');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка при создании платежа. Попробуйте позже.');
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/quick-reply"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Назад</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Простые и понятные тарифы
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            7 дней полного доступа при регистрации. Отмена в любой момент, без скрытых платежей.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isHighlighted = plan.highlighted;

            return (
              <div
                key={plan.id}
                className={`relative bg-card border-2 rounded-2xl p-6 flex flex-col transition-all ${
                  isHighlighted
                    ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div>
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? 'Бесплатно' : `${plan.price} ₽`}
                    </span>
                    {plan.period && (
                      <span className="text-muted">{plan.period}</span>
                    )}
                  </div>
                  {plan.pricePerReply && (
                    <p className="text-xs text-primary font-medium mt-1">{plan.pricePerReply}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading || isCurrent || processingPlan !== null}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-muted-light text-muted cursor-default'
                      : isHighlighted
                      ? 'bg-primary text-white hover:bg-primary-hover'
                      : 'bg-background border border-border hover:border-primary hover:text-primary'
                  } disabled:opacity-50`}
                >
                  {processingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Переход к оплате...
                    </>
                  ) : isCurrent ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Текущий план
                    </>
                  ) : plan.id === 'free' ? (
                    'Начать бесплатно'
                  ) : isHighlighted ? (
                    'Начать сейчас'
                  ) : (
                    `Выбрать ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ / Trust badges */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-medium mb-1">Безопасная оплата</h4>
              <p className="text-sm text-muted">Платежи через ЮKassa с защитой данных</p>
            </div>
            <div>
              <div className="text-2xl mb-2">↩️</div>
              <h4 className="font-medium mb-1">Возврат 14 дней</h4>
              <p className="text-sm text-muted">Полный возврат, если не подошло</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📞</div>
              <h4 className="font-medium mb-1">Поддержка</h4>
              <p className="text-sm text-muted">Отвечаем в течение часа</p>
            </div>
          </div>
        </div>

        {/* B2B */}
        <div className="mt-8 text-center">
          <p className="text-muted">
            Нужен счёт для юрлица или кастомный план?{' '}
            <a href="mailto:hello@myreply.ru" className="text-primary hover:underline">
              Напишите нам
            </a>
          </p>
        </div>

        {/* Legal links */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap justify-center gap-6 text-sm text-muted">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Публичная оферта
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Политика конфиденциальности
          </Link>
          <a href="mailto:hello@myreply.ru" className="hover:text-foreground transition-colors">
            hello@myreply.ru
          </a>
        </div>
      </main>
    </div>
  );
}
