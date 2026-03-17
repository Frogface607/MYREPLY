'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, Loader2, Crown, X, Shield, Clock, Zap, Scale, MessageSquare } from 'lucide-react';
import { PLAN_LIMITS, PLAN_PRICES, PLAN_NAMES, type PlanType, type Subscription } from '@/types';

const plans: {
  id: PlanType;
  name: string;
  price: number;
  period: string;
  description: string;
  subtitle?: string;
  features: string[];
  notIncluded?: string[];
  highlighted?: boolean;
  badge?: string;
}[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '',
    description: 'Попробовать и оценить',
    subtitle: 'Навсегда бесплатно',
    features: [
      '5 ответов в месяц',
      'Базовая генерация AI',
      'Загрузка скриншотов',
    ],
    notIncluded: [
      'Профиль бизнеса',
      'Настройка тона',
      'Deep Research',
      'История ответов',
    ],
  },
  {
    id: 'start',
    name: 'Старт',
    price: 790,
    period: '/мес',
    description: 'Для селлеров и малого бизнеса',
    subtitle: 'Самый популярный',
    features: [
      'Безлимитные ответы',
      'Умный профиль бизнеса',
      'Deep Research — AI изучит вас',
      'Настройка тона общения',
      'Вся история ответов',
      'Приоритетная генерация',
    ],
    highlighted: true,
    badge: 'Популярный',
  },
  {
    id: 'pro',
    name: 'Про',
    price: 1990,
    period: '/мес',
    description: 'Для команд и сетей магазинов',
    features: [
      'Всё из тарифа Старт',
      'До 5 профилей бизнеса',
      'До 3 пользователей',
      'Режим Хардкор',
      'Экспорт истории (CSV)',
      'Приоритетная поддержка',
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
            href="/"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">На главную</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Базовые ответы — бесплатно.
            <br />
            <span className="text-muted">Персональные — от 790 ₽.</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Генерация работает бесплатно и навсегда. Подключите профиль бизнеса — и ответы будут звучать как ваши.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
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
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div>
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? '0 ₽' : `${plan.price.toLocaleString('ru-RU')} ₽`}
                    </span>
                    {plan.period && (
                      <span className="text-muted">{plan.period}</span>
                    )}
                  </div>
                  {plan.subtitle && (
                    <p className="text-xs text-primary font-medium mt-1">{plan.subtitle}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Not included */}
                {plan.notIncluded && (
                  <ul className="space-y-2 mb-6 pt-3 border-t border-border">
                    {plan.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
                        <X className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-40" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

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
                    'Подключить за 790 ₽/мес'
                  ) : (
                    `Выбрать ${plan.name}`
                  )}
                </button>
                {plan.id === 'start' && !isCurrent && (
                  <p className="text-xs text-center text-muted mt-2">
                    7 дней полного доступа при регистрации
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison: Three levels of response */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-center mb-2">Три уровня ответа</h3>
          <p className="text-sm text-muted text-center mb-6">На один и тот же негативный отзыв</p>
          <p className="text-xs text-center text-muted mb-6 italic">
            Отзыв: &laquo;Заказала платье на выпускной дочери. Пришло не того размера, ткань дешёвая, швы торчат. Дочь плакала. Продавцы-мошенники!&raquo;
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-muted-light rounded-xl">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Free — базовый</p>
              <p className="text-sm leading-relaxed italic text-muted">
                &laquo;Благодарим за отзыв. Нам жаль, что вы остались недовольны.
                Мы учтём ваши замечания и постараемся стать лучше. Будем рады видеть вас снова.&raquo;
              </p>
              <span className="inline-block mt-3 px-2 py-1 bg-muted-light border border-border rounded text-xs text-muted">Шаблонный</span>
            </div>
            <div className="p-5 bg-primary-light rounded-xl border border-primary/20">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">Старт — с профилем</p>
              <p className="text-sm leading-relaxed italic">
                &laquo;Здравствуйте! Нам очень жаль, что платье не оправдало ожиданий.
                В нашем магазине &quot;Стиль&quot; все товары проходят проверку качества перед отправкой.
                Напишите нам — оформим возврат или обмен на нужный размер. Хотим, чтобы
                выпускной вашей дочери прошёл идеально!&raquo;
              </p>
              <span className="inline-block mt-3 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary">Персональный</span>
            </div>
            <div className="p-5 bg-primary/5 rounded-xl border border-primary/30">
              <div className="flex items-center gap-1.5 mb-3">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-medium text-primary uppercase tracking-wider">+ Ваша правда</p>
              </div>
              <p className="text-sm leading-relaxed italic">
                &laquo;Здравствуйте! Хотим уточнить: размер был указан корректно в карточке товара,
                и мы дважды подтверждали его с вами в переписке. Ткань — натуральный хлопок,
                сертификаты качества доступны по запросу. Если размер не подошёл — готовы
                оформить обмен. Мы дорожим каждым клиентом и работаем прозрачно.&raquo;
              </p>
              <span className="inline-block mt-3 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary font-medium">Защищает репутацию</span>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
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
        <div className="text-center">
          <p className="text-muted">
            Нужен счёт для юрлица или индивидуальный план?{' '}
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
