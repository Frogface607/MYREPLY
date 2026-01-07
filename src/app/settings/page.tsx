'use client';

import { useEffect, useState } from 'react';
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
  Building2,
  MessageSquare,
  Shield,
  Gift,
  AlertTriangle,
  Star,
  Plus,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { ToneSettings, BusinessRules, BusinessType } from '@/types';

const businessTypeLabels: Record<BusinessType, string> = {
  restaurant: 'Ресторан',
  delivery: 'Доставка еды',
  cafe: 'Кафе',
  marketplace: 'Маркетплейс',
  service: 'Услуги',
  hotel: 'Отель',
  other: 'Другое',
};

const businessTypeHints: Record<BusinessType, string> = {
  restaurant: 'Кухня, атмосфера, обслуживание столиков',
  delivery: 'Скорость, упаковка, температура блюд',
  cafe: 'Кофе, десерты, уютная атмосфера',
  marketplace: 'Товары, доставка, качество',
  service: 'Услуги, качество, сроки',
  hotel: 'Номера, сервис, расположение',
  other: 'Общие настройки',
};

interface ResearchInsights {
  description: string;
  businessType: string;
  commonIssues: string[];
  strengths: string[];
  recommendedTone: ToneSettings;
  recentReviews: string[];
  averageRating: string;
  summary: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [showResearch, setShowResearch] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState<BusinessType>('restaurant');
  const [description, setDescription] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [commonIssues, setCommonIssues] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [newIssue, setNewIssue] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [tone, setTone] = useState<ToneSettings>({ formality: 50, empathy: 60, brevity: 50 });
  const [rules, setRules] = useState<BusinessRules>({
    canApologize: true,
    canOfferPromocode: false,
    canOfferCompensation: false,
    canOfferCallback: true,
  });
  const [customRules, setCustomRules] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('myreply_business');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setName(data.name || '');
        setCity(data.city || '');
        setType(data.type || 'restaurant');
        setDescription(data.description || '');
        setSpecialties(data.specialties || '');
        setCommonIssues(data.commonIssues || []);
        setStrengths(data.strengths || []);
        setTone(data.tone_settings || { formality: 50, empathy: 60, brevity: 50 });
        setRules(data.rules || { canApologize: true, canOfferPromocode: false, canOfferCompensation: false, canOfferCallback: true });
        setCustomRules(data.customRules || '');
      } catch {
        // ignore
      }
    }
    setIsLoading(false);
  }, []);

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
      
      if (ins.description) setDescription(ins.description);
      if (ins.businessType) setType(ins.businessType as BusinessType || type);
      if (ins.commonIssues?.length) setCommonIssues(prev => [...new Set([...prev, ...ins.commonIssues])]);
      if (ins.strengths?.length) setStrengths(prev => [...new Set([...prev, ...ins.strengths])]);
      if (ins.recommendedTone) setTone(ins.recommendedTone);
      
      setShowResearch(false);
    } catch (err) {
      setResearchError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsResearching(false);
    }
  };

  const addIssue = () => {
    if (newIssue.trim() && !commonIssues.includes(newIssue.trim())) {
      setCommonIssues([...commonIssues, newIssue.trim()]);
      setNewIssue('');
    }
  };

  const addStrength = () => {
    if (newStrength.trim() && !strengths.includes(newStrength.trim())) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength('');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    const data = {
      name,
      city,
      type,
      description,
      specialties,
      commonIssues,
      strengths,
      tone_settings: tone,
      rules,
      customRules,
    };
    localStorage.setItem('myreply_business', JSON.stringify(data));
    
    setSaved(true);
    setIsSaving(false);
    setTimeout(() => setSaved(false), 2000);
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
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/quick-reply"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Назад</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Settings className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              saved
                ? 'bg-success text-white'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Сохранено' : 'Сохранить'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          
          {/* Basic Info */}
          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Основная информация</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Название</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Кофейня Бодрое Утро"
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Город</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Москва"
                      className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Тип бизнеса</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as BusinessType)}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:border-primary outline-none"
                >
                  {Object.entries(businessTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <p className="text-xs text-muted mt-1">{businessTypeHints[type]}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Описание и специфика
                  <span className="text-muted font-normal ml-1">(важно для AI)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Например: Семейная пиццерия с итальянской кухней, работаем 10 лет, готовим в дровяной печи, средний чек 1500₽"
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Наши фишки / специализация
                </label>
                <textarea
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  placeholder="Например: Авторские коктейли, живая музыка по пятницам, веранда с видом на парк, детское меню"
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>
          </section>

          {/* Strengths */}
          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-success" />
              <h2 className="font-semibold">Чем гордимся</h2>
              <span className="text-xs text-muted">(AI будет упоминать это)</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {strengths.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success-light text-success rounded-full text-sm"
                >
                  {s}
                  <button
                    onClick={() => setStrengths(strengths.filter((_, idx) => idx !== i))}
                    className="hover:bg-success/20 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {strengths.length === 0 && (
                <span className="text-sm text-muted">Добавьте сильные стороны вашего бизнеса</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addStrength()}
                placeholder="Быстрая доставка, Свежие продукты..."
                className="flex-1 px-3 py-2 bg-background border border-border rounded-xl focus:border-primary outline-none text-sm"
              />
              <button
                onClick={addStrength}
                disabled={!newStrength.trim()}
                className="px-3 py-2 bg-success text-white rounded-xl hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Common Issues */}
          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h2 className="font-semibold">Известные проблемы</h2>
              <span className="text-xs text-muted">(AI не будет отрицать)</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {commonIssues.map((issue, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warning-light text-warning rounded-full text-sm"
                >
                  {issue}
                  <button
                    onClick={() => setCommonIssues(commonIssues.filter((_, idx) => idx !== i))}
                    className="hover:bg-warning/20 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {commonIssues.length === 0 && (
                <span className="text-sm text-muted">О каких проблемах вы знаете?</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIssue()}
                placeholder="Долгое ожидание в час пик..."
                className="flex-1 px-3 py-2 bg-background border border-border rounded-xl focus:border-primary outline-none text-sm"
              />
              <button
                onClick={addIssue}
                disabled={!newIssue.trim()}
                className="px-3 py-2 bg-warning text-white rounded-xl hover:bg-warning/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Tone Settings */}
          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Тон общения</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">😊 Дружелюбно</span>
                  <span className="text-sm font-medium">Формальность</span>
                  <span className="text-sm">👔 Официально</span>
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
                <div className="flex justify-between mb-2">
                  <span className="text-sm">📋 По делу</span>
                  <span className="text-sm font-medium">Эмпатия</span>
                  <span className="text-sm">💝 С душой</span>
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
                <div className="flex justify-between mb-2">
                  <span className="text-sm">📝 Развёрнуто</span>
                  <span className="text-sm font-medium">Длина</span>
                  <span className="text-sm">⚡ Кратко</span>
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
          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Что можно предлагать</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { key: 'canApologize' as const, label: 'Извиняться', icon: '🙏' },
                { key: 'canOfferPromocode' as const, label: 'Промокод', icon: '🎁' },
                { key: 'canOfferCompensation' as const, label: 'Компенсация', icon: '💰' },
                { key: 'canOfferCallback' as const, label: 'Перезвонить', icon: '📞' },
              ].map((rule) => (
                <label
                  key={rule.key}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    rules[rule.key] ? 'border-primary bg-primary-light' : 'border-border hover:border-muted'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    rules[rule.key] ? 'bg-primary border-primary' : 'border-muted'
                  }`}>
                    {rules[rule.key] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-lg">{rule.icon}</span>
                  <span className="text-sm font-medium">{rule.label}</span>
                  <input
                    type="checkbox"
                    checked={rules[rule.key]}
                    onChange={(e) => setRules({ ...rules, [rule.key]: e.target.checked })}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Особые правила
                <span className="text-muted font-normal ml-1">(необязательно)</span>
              </label>
              <textarea
                value={customRules}
                onChange={(e) => setCustomRules(e.target.value)}
                placeholder="Например: Никогда не признавать вину напрямую. Не упоминать конкурентов. Всегда приглашать повторно."
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-none text-sm"
                rows={2}
              />
            </div>
          </section>

          {/* Smart Research - Collapsible */}
          <section className="bg-muted-light border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowResearch(!showResearch)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted-light/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-muted" />
                <div className="text-left">
                  <span className="font-medium text-sm">🔍 Smart Research</span>
                  <p className="text-xs text-muted">AI найдёт информацию о вашем бизнесе</p>
                </div>
              </div>
              {showResearch ? (
                <ChevronUp className="w-5 h-5 text-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted" />
              )}
            </button>
            
            {showResearch && (
              <div className="px-4 pb-4 border-t border-border pt-4">
                {researchError && (
                  <div className="flex items-center gap-2 p-2 bg-danger-light text-danger rounded-lg text-sm mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    {researchError}
                  </div>
                )}

                <button
                  onClick={handleResearch}
                  disabled={isResearching || !name.trim() || !city.trim()}
                  className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Perplexity ищет...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Найти и дополнить профиль
                    </>
                  )}
                </button>
                
                {!name.trim() || !city.trim() ? (
                  <p className="text-xs text-muted text-center mt-2">
                    Сначала укажите название и город выше
                  </p>
                ) : null}
              </div>
            )}
          </section>

          {/* Save Button (mobile) */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-3.5 px-4 font-medium rounded-xl flex items-center justify-center gap-2 transition-all sm:hidden ${
              saved
                ? 'bg-success text-white'
                : 'bg-primary text-white hover:bg-primary-hover'
            } disabled:opacity-50`}
          >
            {saved ? (
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
