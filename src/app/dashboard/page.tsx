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
  Loader2,
  Crown,
  CreditCard,
  User,
  ChevronRight,
  Shield,
  Zap,
  Check,
  ExternalLink,
  Gift,
  Tag,
  Link2,
  Users,
  Trophy,
  Share2,
} from 'lucide-react';
import type { Subscription, PlanType } from '@/types';
import { PLAN_NAMES, PLAN_LIMITS } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [totalResponses, setTotalResponses] = useState(0);
  const [memberSince, setMemberSince] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [referral, setReferral] = useState<{ code: string; url: string; clicks: number; signups: number; nextThreshold: { clicks: number; remaining: number; reward: string } | null } | null>(null);
  const [refCopied, setRefCopied] = useState(false);

  // Передаём access_token в Chrome-расширение (если установлено)
  useEffect(() => {
    const sendTokenToExtension = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;
        if (!extensionId) return;
        const w = window as unknown as { chrome?: { runtime?: { sendMessage?: (id: string, msg: unknown, cb: () => void) => void } } };
        if (w.chrome?.runtime?.sendMessage) {
          w.chrome.runtime.sendMessage(extensionId, { type: 'SET_AUTH_TOKEN', token: session.access_token }, () => {});
        }
      } catch { /* не критично */ }
    };
    sendTokenToExtension();
  }, [supabase]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }
        setUserEmail(user.email || '');
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
        setMemberSince(new Date(user.created_at).toLocaleDateString('ru-RU', {
          day: 'numeric', month: 'long', year: 'numeric',
        }));

        // Загружаем бизнес
        const { data: businessData } = await supabase
          .from('businesses')
          .select('id, name')
          .eq('user_id', user.id)
          .single();
        if (businessData) {
          setBusinessName(businessData.name);

          // Считаем общее количество ответов
          const { count } = await supabase
            .from('response_history')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', businessData.id);
          setTotalResponses(count || 0);
        }

        // Загружаем подписку
        const res = await fetch('/api/subscription');
        if (res.ok) {
          const data = await res.json();
          setSubscription(data.subscription);
        }

        // Загружаем реферальную ссылку
        const refRes = await fetch('/api/referral');
        if (refRes.ok) {
          const refData = await refRes.json();
          if (refData?.code) setReferral(refData);
        }
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

  const handlePromoActivate = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoMessage(null);

    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoMessage({ type: 'error', text: data.error || 'Ошибка активации' });
      } else {
        setPromoMessage({ type: 'success', text: data.message });
        setPromoCode('');
        // Обновляем подписку
        const subRes = await fetch('/api/subscription');
        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscription(subData.subscription);
        }
      }
    } catch {
      setPromoMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setPromoLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const plan = (subscription?.plan || 'free') as PlanType;
  const isPaid = plan === 'start' || plan === 'pro';
  const isTrialing = subscription?.status === 'trialing';
  const usageCount = subscription?.usage_count || 0;
  const usageLimit = subscription?.usage_limit || PLAN_LIMITS[plan];
  const usagePercent = usageLimit > 0 ? Math.min((usageCount / usageLimit) * 100, 100) : 0;

  const trialDaysLeft = isTrialing && subscription?.trial_end
    ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/quick-reply"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <MessageSquareText className="w-5 h-5" />
            <span className="hidden sm:inline">Quick Reply</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <User className="w-5 h-5 text-primary" />
            <span className="font-semibold">Кабинет</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted hover:text-danger transition-colors p-2 rounded-lg hover:bg-muted-light"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        
        {/* User Info */}
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-bold">
                {(userName || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-lg truncate">{userName || 'Пользователь'}</h2>
              <p className="text-sm text-muted truncate">{userEmail}</p>
              <p className="text-xs text-muted mt-0.5">С нами с {memberSince}</p>
            </div>
          </div>
        </section>

        {/* Subscription Card */}
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Crown className={`w-5 h-5 ${isPaid ? 'text-warning' : 'text-muted'}`} />
              <h2 className="font-semibold">Подписка</h2>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              isPaid 
                ? 'bg-primary-light text-primary' 
                : isTrialing 
                  ? 'bg-warning-light text-warning'
                  : 'bg-muted-light text-muted'
            }`}>
              {isTrialing ? `Триал — ${trialDaysLeft} дн.` : PLAN_NAMES[plan]}
            </span>
          </div>

          {/* Usage Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Использовано</span>
              <span className="font-medium">
                {isPaid ? (
                  <span className="text-success">Безлимит</span>
                ) : (
                  <>{usageCount} / {usageLimit}</>
                )}
              </span>
            </div>
            {!isPaid && (
              <div className="w-full h-2 bg-muted-light rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    usagePercent > 80 ? 'bg-danger' : usagePercent > 50 ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Plan Features */}
          <div className="border-t border-border pt-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Профиль бизнеса', active: isPaid || isTrialing },
                { label: 'Deep Research', active: isPaid || isTrialing },
                { label: 'Настройка тона', active: isPaid || isTrialing },
                { label: 'Chrome-расширение', active: plan === 'pro' },
                { label: 'История ответов', active: isPaid || isTrialing },
                { label: 'Безлимит ответов', active: isPaid },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {f.active ? (
                    <Check className="w-4 h-4 text-success shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded border border-border shrink-0" />
                  )}
                  <span className={f.active ? '' : 'text-muted'}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade / Manage */}
          {!isPaid && (
            <Link
              href="/pricing"
              className="w-full py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex items-center justify-center gap-2 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Улучшить план
            </Link>
          )}
          {isPaid && subscription?.current_period_end && (
            <p className="text-xs text-muted text-center">
              Следующее списание: {new Date(subscription.current_period_end).toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          )}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted">Всего ответов</span>
            </div>
            <p className="text-2xl font-semibold">{totalResponses}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted">Время сэкономлено</span>
            </div>
            <p className="text-2xl font-semibold">{Math.round(totalResponses * 7)} мин</p>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {[
            { href: '/quick-reply', icon: MessageSquareText, label: 'Quick Reply', desc: 'Ответить на отзыв', color: 'text-primary' },
            { href: '/settings', icon: Settings, label: 'Профиль бизнеса', desc: businessName || 'Не настроен', color: 'text-muted' },
            { href: '/history', icon: History, label: 'История ответов', desc: `${totalResponses} ответов`, color: 'text-muted' },
            { href: '/pricing', icon: CreditCard, label: 'Тарифы', desc: PLAN_NAMES[plan], color: 'text-muted' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-4 p-4 hover:bg-muted-light/50 transition-colors"
            >
              <div className={`w-10 h-10 bg-muted-light rounded-xl flex items-center justify-center shrink-0`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted truncate">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted shrink-0" />
            </Link>
          ))}
        </section>

        {/* Promo Code */}
        <section className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-sm">Промокод</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePromoActivate()}
              placeholder="Введите промокод"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-xl focus:border-primary outline-none text-sm"
            />
            <button
              onClick={handlePromoActivate}
              disabled={promoLoading || !promoCode.trim()}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
              {promoLoading ? '...' : 'Активировать'}
            </button>
          </div>
          {promoMessage && (
            <p className={`text-xs mt-2 ${promoMessage.type === 'success' ? 'text-success' : 'text-danger'}`}>
              {promoMessage.text}
            </p>
          )}
        </section>

        {/* Referral */}
        {referral && (
          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Share2 className="w-5 h-5 text-success" />
              <div>
                <h2 className="font-semibold text-sm">Приглашай друзей — получай бонусы</h2>
                <p className="text-xs text-muted">Поделись ссылкой, каждый переход приближает к награде</p>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-xs font-mono truncate flex items-center">
                {referral.url}
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(referral.url); setRefCopied(true); setTimeout(() => setRefCopied(false), 2000); }}
                className="px-4 py-2 bg-success text-white text-sm font-medium rounded-xl hover:bg-success/90 flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                {refCopied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                {refCopied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-muted-light rounded-lg p-2.5 text-center">
                <p className="text-xl font-bold">{referral.clicks}</p>
                <p className="text-[10px] text-muted">переходов</p>
              </div>
              <div className="bg-muted-light rounded-lg p-2.5 text-center">
                <p className="text-xl font-bold">{referral.signups}</p>
                <p className="text-[10px] text-muted">регистраций</p>
              </div>
            </div>
            {referral.nextThreshold && (
              <div className="bg-success-light/50 rounded-lg p-2.5 flex items-center gap-2 text-xs">
                <Trophy className="w-4 h-4 text-success flex-shrink-0" />
                <span>Ещё <strong>{referral.nextThreshold.remaining}</strong> переходов → {referral.nextThreshold.reward}</span>
              </div>
            )}
          </section>
        )}

        {/* Legal */}
        <div className="flex justify-center gap-4 text-xs text-muted pt-2 pb-4">
          <Link href="/terms" className="hover:text-foreground transition-colors">Оферта</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Конфиденциальность</Link>
          <button onClick={handleLogout} className="hover:text-danger transition-colors">Выйти из аккаунта</button>
        </div>

      </main>
    </div>
  );
}
