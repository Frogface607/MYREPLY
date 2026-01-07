'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Settings, 
  Loader2, 
  Check,
  Save,
  Search,
  Sparkles,
  MapPin,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import type { Business, ToneSettings, BusinessRules, BusinessType } from '@/types';

const businessTypeLabels: Record<BusinessType, string> = {
  restaurant: 'Ресторан',
  delivery: 'Доставка еды',
  cafe: 'Кафе',
  marketplace: 'Маркетплейс',
  service: 'Услуги',
  hotel: 'Отель',
  other: 'Другое',
};

interface ResearchInsights {
  description: string;
  businessType: string;
  commonIssues: string[];
  strengths: string[];
  recommendedTone: ToneSettings;
  summary: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [insights, setInsights] = useState<ResearchInsights | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState<BusinessType>('other');
  const [description, setDescription] = useState('');
  const [commonIssues, setCommonIssues] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [tone, setTone] = useState<ToneSettings>({ formality: 50, empathy: 50, brevity: 50 });
  const [rules, setRules] = useState<BusinessRules>({
    canApologize: true,
    canOfferPromocode: false,
    canOfferCompensation: false,
    canOfferCallback: true,
  });

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }

        const { data } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          const b = data as Business;
          setBusiness(b);
          setName(b.name);
          setType(b.type);
          setTone(b.tone_settings);
          setRules(b.rules);
          
          if (b.custom_instructions) {
            setDescription(b.custom_instructions);
            const issuesMatch = b.custom_instructions.match(/Частые проблемы: (.+?)(\n|$)/);
            const strengthsMatch = b.custom_instructions.match(/Сильные стороны: (.+?)(\n|$)/);
            if (issuesMatch) setCommonIssues(issuesMatch[1].split(', '));
            if (strengthsMatch) setStrengths(strengthsMatch[1].split(', '));
          }
        }
      } catch (error) {
        console.error('Error loading business:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusiness();
  }, [supabase, router]);

  const handleResearch = async () => {
    if (!name.trim() || !city.trim()) {
      setResearchError('Введите название бизнеса и город');
      return;
    }

    setIsResearching(true);
    setResearchError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: name.trim(), city: city.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка исследования');
      }

      const data = await res.json();
      const ins = data.insights as ResearchInsights;
      
      setInsights(ins);
      setDescription(ins.description);
      setType(ins.businessType as BusinessType || type);
      setCommonIssues(ins.commonIssues || []);
      setStrengths(ins.strengths || []);
      setTone(ins.recommendedTone || tone);
      
    } catch (err) {
      setResearchError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsResearching(false);
    }
  };

  const handleSave = async () => {
    if (!business) return;
    
    setIsSaving(true);
    setSaved(false);

    try {
      const customInstructions = [
        description ? `Описание: ${description}` : '',
        commonIssues.length ? `Частые проблемы: ${commonIssues.join(', ')}` : '',
        strengths.length ? `Сильные стороны: ${strengths.join(', ')}` : '',
      ].filter(Boolean).join('\n\n');

      const { error } = await supabase
        .from('businesses')
        .update({
          name,
          type,
          tone_settings: tone,
          rules,
          custom_instructions: customInstructions || null,
        })
        .eq('id', business.id);

      if (error) throw error;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Назад</span>
          </Link>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span className="font-semibold">Настройки</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Smart Research Section */}
          <section className="bg-primary-light border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Smart Research</h2>
                <p className="text-sm text-muted">AI изучит ваш бизнес и настроит профиль</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Пиццерия Мама Миа"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:border-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Город</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Москва"
                    className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {researchError && (
              <div className="flex items-center gap-2 p-2 bg-danger-light text-danger rounded-lg text-sm mb-3">
                <AlertCircle className="w-4 h-4" />
                {researchError}
              </div>
            )}

            <button
              onClick={handleResearch}
              disabled={isResearching || !name.trim() || !city.trim()}
              className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Изучаем бизнес...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Найти и проанализировать
                </>
              )}
            </button>

            {isResearching && (
              <p className="text-xs text-muted text-center mt-2">
                Ищем в Яндекс.Картах, 2ГИС, Google...
              </p>
            )}
          </section>

          {/* Research Results */}
          {(insights || commonIssues.length > 0 || strengths.length > 0) && (
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Анализ бизнеса</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Краткое описание вашего бизнеса..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <TrendingDown className="w-4 h-4 text-danger" />
                      Частые проблемы
                    </label>
                    <div className="space-y-1">
                      {commonIssues.length > 0 ? (
                        commonIssues.map((issue, i) => (
                          <div key={i} className="text-sm px-3 py-1.5 bg-danger-light text-danger rounded-lg">
                            {issue}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted">Запустите анализ</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      Сильные стороны
                    </label>
                    <div className="space-y-1">
                      {strengths.length > 0 ? (
                        strengths.map((s, i) => (
                          <div key={i} className="text-sm px-3 py-1.5 bg-success-light text-success rounded-lg">
                            {s}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted">Запустите анализ</p>
                      )}
                    </div>
                  </div>
                </div>

                {insights?.summary && (
                  <div className="p-4 bg-primary-light rounded-xl">
                    <p className="text-sm font-medium text-primary mb-1">Рекомендация</p>
                    <p className="text-sm">{insights.summary}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Business Info */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Информация о бизнесе</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Тип бизнеса
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as BusinessType)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                >
                  {Object.entries(businessTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Tone Settings */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Тон общения</h2>
            
            <div className="space-y-6">
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
                  <span className="text-sm text-muted">Развернуто</span>
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
          </section>

          {/* Rules */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Правила ответов</h2>
            
            <div className="space-y-3">
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
          </section>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-3 px-4 font-medium rounded-xl flex items-center justify-center gap-2 transition-all ${
              saved
                ? 'bg-success text-white'
                : 'bg-primary text-white hover:bg-primary-hover'
            } disabled:opacity-50`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Сохраняем...
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Сохранено!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Сохранить изменения
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
