'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Copy, 
  Check, 
  Loader2, 
  Share2, 
  ArrowRight,
  MessageSquareText,
  Sparkles,
  Zap,
  Star,
  Shield,
  Heart,
  ThumbsUp,
  Gift,
  ChevronDown,
  Link2,
  Users,
  Trophy,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface GeneratedResponse {
  id: string;
  text: string;
  accent: string;
  explanation: string;
}

interface ChallengeResult {
  responses: GeneratedResponse[];
  analysis: {
    sentiment: string;
    mainIssue: string | null;
    urgency: string;
  };
}

const accentLabels: Record<string, { label: string; icon: string; desc: string }> = {
  neutral: { label: 'Нейтральный', icon: '⚖️', desc: 'Сбалансированный и профессиональный' },
  empathetic: { label: 'Эмпатичный', icon: '💛', desc: 'С пониманием и теплотой' },
  'solution-focused': { label: 'С решением', icon: '🔧', desc: 'Конкретные действия и предложения' },
  'passive-aggressive': { label: 'Твёрдый', icon: '🛡️', desc: 'Вежливый, но без извинений' },
  hardcore: { label: 'Дерзкий', icon: '🔥', desc: 'Ироничный, с сарказмом и самоиронией' },
};

const accentColors: Record<string, string> = {
  neutral: 'border-border bg-card',
  empathetic: 'border-warning/40 bg-warning-light/30',
  'solution-focused': 'border-success/40 bg-success-light/30',
  'passive-aggressive': 'border-primary/40 bg-primary-light/30',
  hardcore: 'border-danger/40 bg-danger-light/30',
};

const exampleReviews = [
  'Заказали пиццу, ждали 2 часа, приехала холодная. Курьер ещё и нахамил. Позор!',
  'Товар пришёл битый, упаковка вскрыта. Продавец игнорит. Мошенники!',
  'Стрижка ужасная, мастер опоздал на 40 минут. Больше ни ногой!',
  'Заселились в номер — таракан на подушке. Ресепшен сказал "бывает". Серьёзно?!',
];

interface ReferralInfo {
  code: string;
  url: string;
  clicks: number;
  signups: number;
  nextThreshold: { clicks: number; remaining: number; reward: string } | null;
}

export default function ChallengePage() {
  const searchParams = useSearchParams();
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [referral, setReferral] = useState<ReferralInfo | null>(null);
  const [showReferral, setShowReferral] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Трекинг реферального перехода
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      // Фиксируем клик — fire and forget
      fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ref }),
      }).catch(() => {}); // игнорируем ошибки
    }
  }, [searchParams]);

  // Загружаем реферальную ссылку для авторизованных
  useEffect(() => {
    fetch('/api/referral')
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data?.code) setReferral(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Плавный скролл к результатам после загрузки
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [result]);

  const handleGenerate = async () => {
    if (!reviewText.trim() || reviewText.trim().length < 10) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSelectedAccent(null);

    try {
      const res = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText: reviewText.trim() }),
      });

      if (res.status === 429) {
        // Лимит исчерпан
        setLimitReached(true);
        // Сохраняем отзыв для quick-reply после регистрации
        localStorage.setItem('myreply-challenge-review', reviewText.trim());
        setError('limit');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка генерации');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      if (error !== 'limit') {
        setError(err instanceof Error ? err.message : 'Что-то пошло не так');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getShareUrl = () => {
    if (referral?.url) return referral.url;
    return 'https://my-reply.ru/challenge';
  };

  const handleShare = async (response?: GeneratedResponse) => {
    const resp = response || result?.responses.find(r => r.accent === (selectedAccent || 'solution-focused'));
    const url = getShareUrl();
    const shareText = resp
      ? `"${reviewText.slice(0, 150)}${reviewText.length > 150 ? '...' : ''}"\n\n${accentLabels[resp.accent]?.icon || ''} Ответ MyReply:\n"${resp.text}"\n\n✨ Попробуй бесплатно: ${url}`
      : `AI пишет идеальные ответы на отзывы за 30 секунд ✨\nПопробуй бесплатно: ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedId('share');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyReferralLink = () => {
    if (!referral?.url) return;
    navigator.clipboard.writeText(referral.url);
    setCopiedId('referral');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExampleClick = (text: string) => {
    setReviewText(text);
    // Скролл к textarea
    document.getElementById('review-input')?.focus();
  };

  const sentimentEmoji: Record<string, string> = {
    negative: '😤',
    neutral: '😐',
    positive: '😊',
  };

  const urgencyLabel: Record<string, string> = {
    low: 'Не срочно',
    medium: 'Стоит ответить',
    high: 'Ответить немедленно!',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <MessageSquareText className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/pricing"
              className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
            >
              Тарифы
            </Link>
            <Link
              href="/auth"
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Войти
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Попробуйте бесплатно
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-[1.15]">
            Идеальный ответ на отзыв
            <br />
            <span className="text-primary">за 30 секунд</span>
          </h1>
          
          <p className="text-lg text-muted max-w-2xl mx-auto mb-6 leading-relaxed">
            Вставьте отзыв — AI предложит 5 вариантов ответа: 
            от профессионального до дерзкого. 
            Скопируйте лучший или поделитесь с друзьями.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-primary" /> 5 стилей ответа</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-success" /> Без регистрации</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-warning" /> AI анализ отзыва</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <label htmlFor="review-input" className="block text-sm font-medium mb-2">
              Вставьте отзыв, на который нужен ответ:
            </label>
            <textarea
              id="review-input"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Скопируйте сюда текст отзыва клиента..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-none text-base leading-relaxed transition-all"
              rows={4}
              maxLength={2000}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted">{reviewText.length} / 2000</span>
              <button
                onClick={handleGenerate}
                disabled={isLoading || reviewText.trim().length < 10 || limitReached}
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI анализирует...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Получить ответы
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example reviews */}
          {!result && !isLoading && !limitReached && (
            <div className="mt-4">
              <button
                onClick={() => {
                  const el = document.getElementById('examples-section');
                  if (el) el.classList.toggle('hidden');
                }}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mx-auto"
              >
                <ChevronDown className="w-4 h-4" />
                Нет отзыва под рукой? Попробуйте пример
              </button>
              <div id="examples-section" className="hidden mt-3 grid gap-2">
                {exampleReviews.map((review, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(review)}
                    className="text-left text-sm p-3 bg-muted-light hover:bg-primary-light hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20"
                  >
                    &ldquo;{review}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
              <h3 className="font-semibold mb-2">AI анализирует отзыв...</h3>
              <p className="text-sm text-muted">Определяем тональность, проблему и генерируем 5 вариантов ответа</p>
            </div>
          </div>
        )}

        {/* Limit Reached */}
        {error === 'limit' && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 sm:p-8 text-center">
              <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Понравилось? Это только начало!</h3>
              <p className="text-muted mb-6 max-w-md mx-auto">
                Зарегистрируйтесь — получите <strong>15 бесплатных ответов</strong>. 
                А с профилем бизнеса ответы будут персонализированы именно под вас.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                <Link
                  href="/auth"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  Зарегистрироваться бесплатно
                </Link>
              </div>
              <p className="text-sm text-muted">
                Промокод <code className="bg-primary-light px-2 py-0.5 rounded font-mono font-bold text-primary">ЖЕСТЬ</code> — 
                7 дней тарифа «Старт» бесплатно
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && error !== 'limit' && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-danger-light border border-danger/30 rounded-2xl p-4 text-center text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Analysis badge */}
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted-light rounded-full text-sm">
                {sentimentEmoji[result.analysis.sentiment] || '😐'} Тональность: <strong>{result.analysis.sentiment === 'negative' ? 'негативный' : result.analysis.sentiment === 'positive' ? 'позитивный' : 'нейтральный'}</strong>
              </span>
              {result.analysis.mainIssue && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted-light rounded-full text-sm">
                  🎯 {result.analysis.mainIssue}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted-light rounded-full text-sm">
                ⏰ {urgencyLabel[result.analysis.urgency] || 'Стоит ответить'}
              </span>
            </div>

            {/* Header with share */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">5 вариантов ответа</h2>
              <button
                onClick={() => handleShare()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
              >
                {copiedId === 'share' ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copiedId === 'share' ? 'Скопировано!' : 'Поделиться'}
              </button>
            </div>

            {/* All responses */}
            <div className="space-y-4">
              {result.responses.map((response) => {
                const meta = accentLabels[response.accent];
                const isSelected = selectedAccent === response.accent;
                const isHardcore = response.accent === 'hardcore';
                
                return (
                  <div
                    key={response.id}
                    onClick={() => setSelectedAccent(response.accent)}
                    className={`${accentColors[response.accent] || 'border-border bg-card'} border-2 rounded-2xl p-5 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'}`}
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{meta?.icon || '💬'}</span>
                        <div>
                          <span className="text-sm font-semibold">{meta?.label || response.accent}</span>
                          <span className="text-xs text-muted ml-2 hidden sm:inline">{meta?.desc}</span>
                        </div>
                        {isHardcore && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-danger/10 text-danger rounded-full">
                            fun
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShare(response); }}
                          className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-all"
                          title="Поделиться"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(response.id, response.text); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-background hover:bg-primary-light hover:text-primary rounded-lg transition-all border border-border"
                        >
                          {copiedId === response.id ? (
                            <><Check className="w-3.5 h-3.5" /> Скопировано</>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /> Копировать</>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="leading-relaxed mb-3 text-[15px]">{response.text}</p>
                    <p className="text-xs text-muted italic">{response.explanation}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA after results */}
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 sm:p-8 text-center">
              <div className="flex justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <Heart className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-xl font-bold mb-2">Хотите ответы под ваш бизнес?</h3>
              <p className="text-muted mb-6 max-w-lg mx-auto">
                С профилем бизнеса AI знает ваш тон, сильные стороны и правила. 
                Ответы звучат <strong>именно как вы</strong> — не шаблонно, а по-настоящему.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
                <Link
                  href="/auth"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  Попробовать бесплатно
                </Link>
                <Link
                  href="/pricing"
                  className="px-6 py-3 bg-background border border-border rounded-xl hover:border-primary flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  Посмотреть тарифы
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-primary" />
                  15 бесплатных ответов при регистрации
                </span>
                <span className="hidden sm:block">•</span>
                <span>
                  Промокод <code className="bg-primary-light px-1.5 py-0.5 rounded font-mono font-bold text-primary text-xs">ЖЕСТЬ</code> — 7 дней «Старт»
                </span>
              </div>
            </div>

            {/* Share-for-bonus — для авторизованных */}
            {referral && (
              <div className="bg-card border-2 border-success/30 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-success-light rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-bold">Поделись — получи бонусы</h3>
                    <p className="text-xs text-muted">Каждый переход по вашей ссылке приближает к награде</p>
                  </div>
                </div>

                {/* Referral link */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 px-3 py-2.5 bg-background border border-border rounded-xl text-sm font-mono truncate">
                    {referral.url}
                  </div>
                  <button
                    onClick={handleCopyReferralLink}
                    className="px-4 py-2.5 bg-success text-white text-sm font-medium rounded-xl hover:bg-success/90 transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    {copiedId === 'referral' ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    {copiedId === 'referral' ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted-light rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{referral.clicks}</p>
                    <p className="text-xs text-muted">переходов</p>
                  </div>
                  <div className="bg-muted-light rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{referral.signups}</p>
                    <p className="text-xs text-muted">регистраций</p>
                  </div>
                </div>

                {/* Next threshold */}
                {referral.nextThreshold && (
                  <div className="bg-success-light/50 rounded-xl p-3 flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-success flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium">Ещё {referral.nextThreshold.remaining} переходов</span>
                      <span className="text-muted"> → {referral.nextThreshold.reward}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted mt-3 text-center">
                  Делитесь ссылкой в соцсетях, мессенджерах, с коллегами — бонусы начисляются автоматически
                </p>
              </div>
            )}
          </div>
        )}

        {/* Features - before result */}
        {!result && !isLoading && (
          <div className="max-w-3xl mx-auto mt-12">
            {/* How it works */}
            <div className="grid sm:grid-cols-3 gap-6 mb-16">
              {[
                { 
                  icon: <MessageSquareText className="w-6 h-6 text-primary" />, 
                  title: 'Вставьте отзыв', 
                  desc: 'Скопируйте отзыв клиента — негативный, нейтральный, любой' 
                },
                { 
                  icon: <Sparkles className="w-6 h-6 text-primary" />, 
                  title: 'AI анализирует', 
                  desc: 'Определит тон, проблему и предложит 5 вариантов ответа' 
                },
                { 
                  icon: <ThumbsUp className="w-6 h-6 text-primary" />, 
                  title: 'Выберите лучший', 
                  desc: 'Скопируйте готовый ответ или поделитесь с коллегами' 
                },
              ].map((item, i) => (
                <div key={i} className="text-center p-5 bg-card border border-border rounded-2xl">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* 5 styles */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">5 стилей — один идеальный</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(accentLabels).map(([key, meta]) => (
                  <div key={key} className={`p-4 rounded-xl border-2 ${accentColors[key]}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{meta.icon}</span>
                      <span className="font-semibold text-sm">{meta.label}</span>
                    </div>
                    <p className="text-xs text-muted">{meta.desc}</p>
                  </div>
                ))}
                <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center text-center">
                  <div>
                    <span className="text-lg">🎯</span>
                    <p className="text-xs text-muted mt-1">С профилем бизнеса — ответы персонализированы</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For whom */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">Для любого бизнеса с отзывами</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  '🛒 Маркетплейсы',
                  '🍕 Рестораны и кафе',
                  '🏨 Отели',
                  '💇 Салоны красоты',
                  '🏥 Медицина',
                  '🔧 Сервисы и услуги',
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 bg-card border border-border rounded-xl text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Example */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h3 className="font-semibold mb-5 text-center">Пример работы MyReply</h3>
              <div className="bg-muted-light rounded-xl p-4 mb-5">
                <p className="text-xs text-muted mb-1.5 font-medium">Отзыв клиента:</p>
                <p className="text-sm italic leading-relaxed">&ldquo;Заказали пиццу, ждали 2 часа, приехала холодная. Курьер ещё и нахамил. Больше никогда!&rdquo;</p>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-success pl-4">
                  <p className="text-xs text-success mb-1 font-medium">🔧 С решением</p>
                  <p className="text-sm leading-relaxed">&ldquo;Спасибо за обратную связь. Задержка 2 часа — неприемлема для нас. Мы разобрались с логистикой и провели беседу с курьером. Будем рады загладить вину — напишите нам в директ.&rdquo;</p>
                </div>
                <div className="border-l-4 border-warning pl-4">
                  <p className="text-xs text-warning mb-1 font-medium">💛 Эмпатичный</p>
                  <p className="text-sm leading-relaxed">&ldquo;Понимаем ваше разочарование — ждать 2 часа и получить холодную пиццу действительно обидно. Нам искренне жаль. Мы уже приняли меры, чтобы такое не повторилось.&rdquo;</p>
                </div>
                <div className="border-l-4 border-danger pl-4">
                  <p className="text-xs text-danger mb-1 font-medium">🔥 Дерзкий</p>
                  <p className="text-sm leading-relaxed">&ldquo;Два часа — это просто наш шеф-повар медитировал над вашим заказом. А холодная пицца — авторская подача. Но если серьёзно — разобрались, виновные наказаны, пицца реабилитирована.&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted mb-2">
            <Link href="/" className="hover:text-foreground transition-colors font-medium">MyReply</Link> — AI-ответы на отзывы для любого бизнеса
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted">
            <a href="https://t.me/myreply_ru" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Telegram</a>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Тарифы</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Оферта</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
