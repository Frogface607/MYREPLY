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
  Save
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

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<BusinessType>('other');
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
        }
      } catch (error) {
        console.error('Error loading business:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusiness();
  }, [supabase, router]);

  const handleSave = async () => {
    if (!business) return;
    
    setIsSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name,
          type,
          tone_settings: tone,
          rules,
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
          {/* Business Info */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Информация о бизнесе</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                />
              </div>

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

