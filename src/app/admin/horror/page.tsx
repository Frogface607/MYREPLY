'use client';

import { useEffect, useState } from 'react';
import { Check, X, Loader2, Edit3, Skull, RefreshCw } from 'lucide-react';

interface HorrorItem {
  id: string;
  review_text: string;
  business_type: string | null;
  business_name_anon: string | null;
  ai_response: string | null;
  status: string;
  promo_code: string | null;
  submitter_email: string | null;
  likes: number;
  created_at: string;
}

export default function AdminHorrorPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<HorrorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [error, setError] = useState<string | null>(null);

  const load = async (secretToUse: string = secret) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/horror/list?status=${statusFilter}`, {
        headers: { 'x-admin-secret': secretToUse },
      });
      if (res.status === 401) {
        setAuthed(false);
        setError('Неверный пароль');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      setItems(data.items || []);
      setAuthed(true);
      try {
        sessionStorage.setItem('horror_admin_secret', secretToUse);
      } catch {}
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('horror_admin_secret');
      if (saved) {
        setSecret(saved);
        load(saved);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authed) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const approve = async (id: string) => {
    setBusy((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/admin/horror/approve/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ business_name_anon: editing[id] || undefined }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка');
      }
    } finally {
      setBusy((s) => ({ ...s, [id]: false }));
    }
  };

  const reject = async (id: string) => {
    if (!confirm('Отклонить этот отзыв?')) return;
    setBusy((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/admin/horror/reject/${id}`, {
        method: 'POST',
        headers: { 'x-admin-secret': secret },
      });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      }
    } finally {
      setBusy((s) => ({ ...s, [id]: false }));
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
          className="bg-card border border-border rounded-2xl p-8 w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-6">
            <Skull className="w-6 h-6 text-danger" />
            <h1 className="text-2xl font-bold">Horror Admin</h1>
          </div>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors mb-4"
            autoFocus
          />
          {error && <p className="text-danger text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading || !secret}
            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all disabled:opacity-50"
          >
            {loading ? 'Проверяем...' : 'Войти'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="w-5 h-5 text-danger" />
            <h1 className="text-lg font-bold">Horror Reviews Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            {(['pending', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border hover:border-primary/40'
                }`}
              >
                {s === 'pending' ? 'Ожидают' : s === 'approved' ? 'Одобрено' : 'Отклонено'}
              </button>
            ))}
            <button
              onClick={() => load()}
              className="p-2 rounded-full bg-card border border-border hover:border-primary/40 transition-all"
              title="Обновить"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted">
            Нет отзывов со статусом &quot;{statusFilter}&quot;
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-muted">
                  <span className="px-2 py-1 bg-background rounded-full border border-border">
                    {item.business_type}
                  </span>
                  <span>{item.submitter_email}</span>
                  <span>{new Date(item.created_at).toLocaleString('ru-RU')}</span>
                  {item.promo_code && (
                    <code className="px-2 py-1 bg-primary-light/30 rounded text-primary font-mono">
                      {item.promo_code}
                    </code>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wide text-danger font-semibold mb-2">
                    Отзыв
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {item.review_text}
                  </p>
                </div>

                {item.ai_response && (
                  <div className="bg-primary-light/30 border border-primary/20 rounded-xl p-4 mb-4">
                    <div className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">
                      AI Ответ
                    </div>
                    <p className="whitespace-pre-wrap">{item.ai_response}</p>
                  </div>
                )}

                {statusFilter === 'pending' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-muted mb-1 flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Обезличенное название (опционально)
                      </label>
                      <input
                        type="text"
                        value={editing[item.id] || item.business_name_anon || ''}
                        onChange={(e) =>
                          setEditing((s) => ({ ...s, [item.id]: e.target.value }))
                        }
                        placeholder="Напр.: Кафе из Москвы"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(item.id)}
                        disabled={busy[item.id]}
                        className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-full text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {busy[item.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Одобрить + AI ответ
                      </button>
                      <button
                        onClick={() => reject(item.id)}
                        disabled={busy[item.id]}
                        className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger border border-danger/30 rounded-full text-sm font-medium hover:bg-danger/20 transition-all disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Отклонить
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
