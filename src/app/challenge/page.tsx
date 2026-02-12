'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Copy, 
  Check, 
  Loader2, 
  Share2, 
  Download,
  ArrowRight,
  MessageSquareText,
  Sparkles,
  Trophy,
  Zap
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

const accentLabels: Record<string, string> = {
  neutral: '😐 Нейтральный',
  empathetic: '💛 Эмпатичный',
  'solution-focused': '🔧 С решением',
  'passive-aggressive': '🧊 Формально-холодный',
  hardcore: '🔥 Дерзкий',
};

const accentColors: Record<string, string> = {
  neutral: 'border-border',
  empathetic: 'border-warning',
  'solution-focused': 'border-success',
  'passive-aggressive': 'border-primary',
  hardcore: 'border-danger',
};

export default function ChallengePage() {
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!reviewText.trim() || reviewText.trim().length < 10) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewText: reviewText.trim(),
          includeHardcore: true,
          source: 'challenge',
        }),
      });

      if (res.status === 401) {
        setError('auth');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка генерации');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Что-то пошло не так');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async () => {
    const hardcoreResponse = result?.responses.find(r => r.accent === 'hardcore');
    const shareText = hardcoreResponse 
      ? `Мой самый жёсткий отзыв:\n\n"${reviewText.slice(0, 200)}${reviewText.length > 200 ? '...' : ''}"\n\nОтвет MyReply:\n\n"${hardcoreResponse.text}"\n\n🔥 Попробуй сам: my-reply.ru/challenge`
      : `Попробуй MyReply — AI отвечает на отзывы: my-reply.ru/challenge`;

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <MessageSquareText className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-danger-light text-danger rounded-full text-sm font-medium mb-6">
            <Flame className="w-4 h-4" />
            Челлендж
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1]">
            Покажи свой самый
            <br />
            <span className="text-danger">жёсткий отзыв</span>
          </h1>
          
          <p className="text-lg text-muted max-w-2xl mx-auto mb-4 leading-relaxed">
            Вставь отзыв, от которого хотелось выбросить телефон в окно. 
            AI ответит так, что ты заплачешь от смеха. 
            А потом — профессионально, филигранно и красиво.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-warning" /> 5 вариантов ответа</span>
            <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-danger" /> Включая дерзкий режим</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-primary" /> Бесплатно</span>
          </div>
        </div>

        {/* Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <label className="block text-sm font-medium mb-3">
              Вставь самый кринжовый отзыв:
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="«Ваша пицца была как картон, курьер нахамил, и вообще я нашёл волос. Никогда больше не закажу...»"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-none text-base leading-relaxed"
              rows={5}
              maxLength={2000}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted">{reviewText.length} / 2000</span>
              <button
                onClick={handleGenerate}
                disabled={isLoading || reviewText.trim().length < 10}
                className="px-6 py-3 bg-danger text-white font-medium rounded-xl hover:bg-danger/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI думает...
                  </>
                ) : (
                  <>
                    <Flame className="w-5 h-5" />
                    Ответить дерзко
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Auth required */}
        {error === 'auth' && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-warning-light border border-warning/30 rounded-2xl p-6 text-center">
              <h3 className="font-semibold mb-2">Нужна регистрация</h3>
              <p className="text-sm text-muted mb-4">
                Войдите или зарегистрируйтесь, чтобы сгенерировать ответы. 
                Это бесплатно — у вас будет 15 ответов.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/auth?next=/challenge"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Войти / Зарегистрироваться
                </Link>
              </div>
              <p className="text-xs text-muted mt-4">
                Есть промокод? Активируйте после входа в <Link href="/dashboard" className="text-primary hover:underline">кабинете</Link>
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && error !== 'auth' && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-danger-light border border-danger/30 rounded-2xl p-4 text-center text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Share bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Вот что MyReply может:</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
                >
                  {copiedId === 'share' ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copiedId === 'share' ? 'Скопировано!' : 'Поделиться'}
                </button>
              </div>
            </div>

            {/* Share card - the hardcore response highlighted */}
            {result.responses.find(r => r.accent === 'hardcore') && (
              <div ref={shareCardRef} className="bg-gradient-to-br from-danger-light to-background border-2 border-danger/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center gap-1 text-danger text-xs font-bold">
                  <Flame className="w-4 h-4" />
                  ДЕРЗКИЙ
                </div>
                <div className="mb-4">
                  <p className="text-xs text-muted mb-1">Отзыв:</p>
                  <p className="text-sm italic text-muted leading-relaxed">
                    &ldquo;{reviewText.slice(0, 300)}{reviewText.length > 300 ? '...' : ''}&rdquo;
                  </p>
                </div>
                <div className="border-t border-danger/20 pt-4">
                  <p className="text-xs text-danger mb-1 font-medium">Ответ MyReply:</p>
                  <p className="text-base leading-relaxed font-medium">
                    {result.responses.find(r => r.accent === 'hardcore')?.text}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquareText className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">my-reply.ru</span>
                  </div>
                  <span className="text-xs text-muted">AI-ответы на отзывы</span>
                </div>
              </div>
            )}

            {/* All responses */}
            <div className="space-y-4">
              {result.responses.map((response) => (
                <div
                  key={response.id}
                  className={`bg-card border-2 ${accentColors[response.accent] || 'border-border'} rounded-2xl p-5 transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      {accentLabels[response.accent] || response.accent}
                    </span>
                    <button
                      onClick={() => handleCopy(response.id, response.text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted-light hover:bg-primary-light hover:text-primary rounded-lg transition-all"
                    >
                      {copiedId === response.id ? (
                        <><Check className="w-3.5 h-3.5" /> Скопировано</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Копировать</>
                      )}
                    </button>
                  </div>
                  <p className="leading-relaxed mb-3">{response.text}</p>
                  <p className="text-xs text-muted">{response.explanation}</p>
                </div>
              ))}
            </div>

            {/* Promo CTA */}
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-8 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Понравилось? Это только начало!</h3>
              <p className="text-muted mb-6 max-w-lg mx-auto">
                С профилем бизнеса ответы будут звучать <strong>именно как ваши</strong> — 
                с учётом тона, правил и специфики. Безлимитно.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                <Link
                  href="/auth"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Попробовать бесплатно
                </Link>
                <Link
                  href="/pricing"
                  className="px-6 py-3 bg-background border border-border rounded-xl hover:border-primary flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  Тарифы
                </Link>
              </div>
              <p className="text-sm text-muted">
                Промокод <code className="bg-muted-light px-2 py-0.5 rounded font-mono font-bold text-danger">ЖЕСТЬ</code> — 
                1 месяц тарифа «Старт» бесплатно
              </p>
            </div>
          </div>
        )}

        {/* How it works - before result */}
        {!result && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              {[
                { step: '1', title: 'Вставь отзыв', desc: 'Самый жёсткий, кринжовый, несправедливый — любой' },
                { step: '2', title: 'AI ответит', desc: '5 вариантов: от профессионального до дерзкого' },
                { step: '3', title: 'Поделись', desc: 'Отправь друзьям или используй в бизнесе' },
              ].map((item) => (
                <div key={item.step} className="text-center p-4">
                  <div className="w-10 h-10 bg-danger text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Examples */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h3 className="font-semibold mb-4 text-center">Примеры того, что может MyReply:</h3>
              <div className="space-y-4">
                <div className="bg-muted-light rounded-xl p-4">
                  <p className="text-sm text-muted mb-2">Отзыв:</p>
                  <p className="text-sm italic mb-3">&ldquo;Заказали пиццу, ждали 2 часа, приехала холодная. Курьер ещё и нахамил. Больше никогда!&rdquo;</p>
                  <p className="text-sm text-danger mb-1 font-medium">🔥 Дерзкий:</p>
                  <p className="text-sm">&ldquo;Два часа — это время, за которое наш шеф-повар медитирует перед приготовлением вашего заказа. Холодная пицца? Это авторская подача — горячая пицца переоценена. А курьер просто практикует искусство прямолинейной коммуникации.&rdquo;</p>
                </div>
                <div className="bg-muted-light rounded-xl p-4">
                  <p className="text-sm text-success mb-1 font-medium">🔧 Профессиональный:</p>
                  <p className="text-sm">&ldquo;Спасибо за обратную связь. Задержка в 2 часа — абсолютно неприемлема для нас. Мы уже разобрались с логистикой и провели беседу с курьером. Будем рады загладить вину — напишите нам в директ, мы предложим решение.&rdquo;</p>
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
            <Link href="/" className="hover:text-foreground transition-colors">MyReply</Link> — AI-ответы на отзывы для любого бизнеса
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted">
            <Link href="/terms" className="hover:text-foreground transition-colors">Оферта</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
