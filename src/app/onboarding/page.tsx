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
  Check
} from 'lucide-react';

const businessTypes: { value: BusinessType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'restaurant', label: 'Ресторан', icon: <Building2 className="w-6 h-6" />, description: 'Рестораны, бары, кулинарии' },
  { value: 'delivery', label: 'Доставка еды', icon: <Truck className="w-6 h-6" />, description: 'Сервисы доставки, дарк китчен' },
  { value: 'cafe', label: 'Кафе', icon: <Coffee className="w-6 h-6" />, description: 'Кофейни, пекарни, фастфуд' },
  { value: 'marketplace', label: 'Маркетплейс', icon: <ShoppingBag className="w-6 h-6" />, description: 'Ozon, Wildberries, Яндекс.Маркет' },
  { value: 'service', label: 'Услуги', icon: <Wrench className="w-6 h-6" />, description: 'Салоны, ремонт, клиники' },
  { value: 'hotel', label: 'Отель', icon: <Hotel className="w-6 h-6" />, description: 'Гостиницы, апартаменты, хостелы' },
  { value: 'other', label: 'Другое', icon: <MoreHorizontal className="w-6 h-6" />, description: 'Любой другой бизнес' },
];

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
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [tone, setTone] = useState<ToneSettings>(defaultTone);
  const [rules, setRules] = useState<BusinessRules>(defaultRules);

  const handleComplete = async () => {
    if (!businessType) return;
    
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
        });

      if (dbError) throw dbError;

      router.push('/dashboard');
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
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-primary' : s < step ? 'w-8 bg-success' : 'w-8 bg-border'
              }`}
            />
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in">
          {/* Step 1: Business Type */}
          {step === 1 && (
            <>
              <h1 className="text-2xl font-semibold mb-2 text-center">
                Какой у вас бизнес?
              </h1>
              <p className="text-muted text-center mb-8">
                Это поможет нам подобрать правильный стиль ответов
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setBusinessType(type.value)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      businessType === type.value
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-muted'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      businessType === type.value ? 'bg-primary text-white' : 'bg-muted-light text-muted'
                    }`}>
                      {type.icon}
                    </div>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Название бизнеса (необязательно)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Например: Пиццерия «Мама Миа»"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!businessType}
                className="w-full py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Далее
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Step 2: Tone Settings */}
          {step === 2 && (
            <>
              <h1 className="text-2xl font-semibold mb-2 text-center">
                Настройте тон общения
              </h1>
              <p className="text-muted text-center mb-8">
                Подвигайте ползунки — мы подстроим стиль ответов
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
                  onClick={() => setStep(1)}
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

