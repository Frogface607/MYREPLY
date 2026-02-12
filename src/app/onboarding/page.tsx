'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { BusinessType, ToneSettings, BusinessRules } from '@/types';
import { 
  Building2, 
  Truck, 
  Coffee, 
  ShoppingBag, 
  Wrench, 
  Hotel,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  Search,
  Sparkles,
  MapPin,
  AlertCircle,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

const businessTypes: { value: BusinessType; label: string; icon: React.ReactNode }[] = [
  { value: 'restaurant', label: 'Ресторан', icon: <Building2 className="w-5 h-5" /> },
  { value: 'delivery', label: 'Доставка еды', icon: <Truck className="w-5 h-5" /> },
  { value: 'cafe', label: 'Кафе', icon: <Coffee className="w-5 h-5" /> },
  { value: 'marketplace', label: 'Маркетплейс', icon: <ShoppingBag className="w-5 h-5" /> },
  { value: 'service', label: 'Услуги', icon: <Wrench className="w-5 h-5" /> },
  { value: 'hotel', label: 'Отель', icon: <Hotel className="w-5 h-5" /> },
  { value: 'other', label: 'Другое', icon: <MoreHorizontal className="w-5 h-5" /> },
];

interface ResearchInsights {
  description: string;
  businessType: string;
  commonIssues: string[];
  strengths: string[];
  recommendedTone: ToneSettings;
  competitorInsights: string;
  summary: string;
}

const defaultTone: ToneSettings = {
  formality: 50,
  empathy: 50,
  brevity: 50,
};

const defaultRules: BusinessRules = {
  canApologize: true,
  canOfferPromocode: false,
  canOfferCompensation: false,
  canOfferCallback: true,
};

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState(0); // 0 = поиск, 1 = результаты, 2 = тон, 3 = правила
  const [isLoading, setIsLoading] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('other');
  const [description, setDescription] = useState('');
  const [commonIssues, setCommonIssues] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [tone, setTone] = useState<ToneSettings>(defaultTone);
  const [rules, setRules] = useState<BusinessRules>(defaultRules);
  const [insights, setInsights] = useState<ResearchInsights | null>(null);

  const handleResearch = async () => {
    if (!businessName.trim() || !city.trim()) {
      setError('Введите название бизнеса и город');
      return;
    }

    setIsResearching(true);
    setError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: businessName.trim(), city: city.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка исследования');
      }

      const data = await res.json();
      const ins = data.insights as ResearchInsights;
      
      setInsights(ins);
      setDescription(ins.description);
      setBusinessType(ins.businessType as BusinessType || 'other');
      setCommonIssues(ins.commonIssues || []);
      setStrengths(ins.strengths || []);
      setTone(ins.recommendedTone || defaultTone);
      
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsResearching(false);
    }
  };

  const handleSkipResearch = () => {
    setStep(2);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Не авторизован');

      const { error: dbError } = await supabase
        .from('businesses')
        .insert({
          user_id: user.id,
          name: businessName || 'Мой бизнес',
          type: businessType,
          tone_settings: tone,
          rules: rules,
          custom_instructions: description ? `Описание: ${description}\n\nЧастые проблемы: ${commonIssues.join(', ')}\n\nСильные стороны: ${strengths.join(', ')}` : null,
        });

      if (dbError) throw dbError;

      router.push('/quick-reply');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-primary' : s < step ? 'w-8 bg-success' : 'w-8 bg-border'
              }`}
            />
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in">
          
          {/* Step 0: Smart Search */}
          {step === 0 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-semibold mb-2">
                  Найдём ваш бизнес
                </h1>
                <p className="text-muted">
                  Мы изучим отзывы и настроим MyReply под вас
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Название бизнеса
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Например: Пиццерия Мама Миа"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Город
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Например: Москва"
                      className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-danger-light text-danger rounded-lg text-sm mb-4">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                onClick={handleResearch}
                disabled={isResearching || !businessName.trim() || !city.trim()}
                className="w-full py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
              >
                {isResearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Изучаем ваш бизнес...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Найти и изучить
                  </>
                )}
              </button>

              <button
                onClick={handleSkipResearch}
                className="w-full py-3 px-4 text-muted hover:text-foreground font-medium transition-colors"
              >
                Пропустить и настроить вручную
              </button>

              {isResearching && (
                <div className="mt-6 p-4 bg-muted-light rounded-xl">
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <div className="animate-pulse">🔍</div>
                    <span>Ищем информацию в Яндекс.Картах, 2ГИС, Google...</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 1: Research Results */}
          {step === 1 && insights && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h1 className="text-2xl font-semibold mb-2">
                  Мы изучили ваш бизнес!
                </h1>
                <p className="text-muted">
                  Проверьте и скорректируйте если нужно
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none resize-none"
                    rows={2}
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Тип бизнеса</label>
                  <div className="flex flex-wrap gap-2">
                    {businessTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setBusinessType(type.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                          businessType === type.value
                            ? 'border-primary bg-primary-light'
                            : 'border-border hover:border-muted'
                        }`}
                      >
                        {type.icon}
                        <span className="text-sm">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Issues & Strengths */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <TrendingDown className="w-4 h-4 text-danger" />
                      Частые проблемы
                    </label>
                    <div className="space-y-1">
                      {commonIssues.map((issue, i) => (
                        <div key={i} className="text-sm px-3 py-1.5 bg-danger-light text-danger rounded-lg">
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      Сильные стороны
                    </label>
                    <div className="space-y-1">
                      {strengths.map((s, i) => (
                        <div key={i} className="text-sm px-3 py-1.5 bg-success-light text-success rounded-lg">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-primary-light rounded-xl">
                  <p className="text-sm font-medium text-primary mb-1">💡 Рекомендация</p>
                  <p className="text-sm">{insights.summary}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="py-3 px-4 border border-border rounded-xl hover:bg-muted-light flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex items-center justify-center gap-2"
                >
                  Продолжить
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {/* Step 2: Tone Settings */}
          {step === 2 && (
            <>
              <h1 className="text-2xl font-semibold mb-2 text-center">
                Настройте тон общения
              </h1>
              <p className="text-muted text-center mb-8">
                {insights ? 'Мы предложили настройки на основе анализа' : 'Подвигайте ползунки под ваш стиль'}
              </p>

              <div className="space-y-8 mb-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-muted">Дружелюбно</span>
                    <span className="text-sm font-medium">Формальность</span>
                    <span className="text-sm text-muted">Официально</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tone.formality}
                    onChange={(e) => setTone({ ...tone, formality: Number(e.target.value) })}
                    className="w-full h-2 bg-muted-light rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-muted">Сдержанно</span>
                    <span className="text-sm font-medium">Эмпатия</span>
                    <span className="text-sm text-muted">С душой</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tone.empathy}
                    onChange={(e) => setTone({ ...tone, empathy: Number(e.target.value) })}
                    className="w-full h-2 bg-muted-light rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-muted">Развёрнуто</span>
                    <span className="text-sm font-medium">Длина</span>
                    <span className="text-sm text-muted">Кратко</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tone.brevity}
                    onChange={(e) => setTone({ ...tone, brevity: Number(e.target.value) })}
                    className="w-full h-2 bg-muted-light rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(insights ? 1 : 0)}
                  className="py-3 px-4 border border-border rounded-xl hover:bg-muted-light flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover flex items-center justify-center gap-2"
                >
                  Далее
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {/* Step 3: Rules */}
          {step === 3 && (
            <>
              <h1 className="text-2xl font-semibold mb-2 text-center">
                Правила ответов
              </h1>
              <p className="text-muted text-center mb-8">
                Что можно и нельзя в ваших ответах?
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { key: 'canApologize' as const, label: 'Можно извиняться', desc: 'Использовать извинения когда уместно' },
                  { key: 'canOfferPromocode' as const, label: 'Можно предлагать промокод', desc: 'Как жест доброй воли' },
                  { key: 'canOfferCompensation' as const, label: 'Можно предлагать компенсацию', desc: 'В сложных случаях' },
                  { key: 'canOfferCallback' as const, label: 'Можно предлагать связаться', desc: 'Для решения вопроса лично' },
                ].map((rule) => (
                  <label
                    key={rule.key}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      rules[rule.key] ? 'border-primary bg-primary-light' : 'border-border hover:border-muted'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      rules[rule.key] ? 'bg-primary border-primary' : 'border-muted'
                    }`}>
                      {rules[rule.key] && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{rule.label}</div>
                      <div className="text-sm text-muted">{rule.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={rules[rule.key]}
                      onChange={(e) => setRules({ ...rules, [rule.key]: e.target.checked })}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>

              {error && (
                <div className="p-3 bg-danger-light text-danger rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="py-3 px-4 border border-border rounded-xl hover:bg-muted-light flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Назад
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Сохраняем...
                    </>
                  ) : (
                    <>
                      Готово!
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
