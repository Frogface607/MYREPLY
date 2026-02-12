'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { PLAN_NAMES, PLAN_LIMITS, type PlanType } from '@/types';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') as PlanType | null;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Даём время webhook обработать платёж
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted">Обрабатываем платёж...</p>
        </div>
      </div>
    );
  }

  const planName = plan ? PLAN_NAMES[plan] : 'Премиум';
  const planLimit = plan ? PLAN_LIMITS[plan] : null;
  const limitText = planLimit && planLimit < 999999 
    ? `${planLimit} ответов в месяц` 
    : 'безлимитные ответы';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold mb-3">
            Оплата прошла успешно!
          </h1>

          <p className="text-muted mb-2">
            Тариф <span className="font-semibold text-foreground">{planName}</span> активирован.
          </p>
          <p className="text-muted mb-8">
            У вас {limitText} — используйте на полную.
          </p>

          {/* What's next */}
          <div className="bg-primary-light rounded-xl p-4 mb-8 text-left">
            <h3 className="font-medium text-primary mb-2">Что дальше?</h3>
            <ul className="text-sm space-y-2 text-foreground">
              <li>✓ Настройте профиль бизнеса — ответы станут персональными</li>
              <li>✓ Запустите Deep Research — AI изучит вашу специфику</li>
              <li>✓ Сгенерируйте ответ — это займёт секунды</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link
              href="/settings"
              className="w-full py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Настроить профиль бизнеса
            </Link>

            <Link
              href="/quick-reply"
              className="w-full py-3 px-4 bg-background border border-border rounded-xl hover:border-primary hover:text-primary flex items-center justify-center gap-2 transition-colors"
            >
              Сразу к ответам
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
