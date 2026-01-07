'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  ArrowLeft, 
  History, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown,
  Loader2,
  MessageSquareText
} from 'lucide-react';
import type { ResponseHistory } from '@/types';

export default function HistoryPage() {
  const supabase = createClient();
  const [history, setHistory] = useState<ResponseHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        setHistory(data.history || []);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [supabase]);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const accentLabels: Record<string, string> = {
    neutral: 'Нейтральный',
    empathetic: 'Эмпатичный',
    'solution-focused': 'С решением',
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Назад</span>
          </Link>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <span className="font-semibold">История ответов</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted-light rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareText className="w-8 h-8 text-muted" />
            </div>
            <h2 className="text-xl font-semibold mb-2">История пуста</h2>
            <p className="text-muted mb-6">
              Здесь будут появляться ответы, которые вы скопировали
            </p>
            <Link
              href="/quick-reply"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
            >
              Перейти в Quick Reply
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl p-5 animate-fade-in"
              >
                {/* Review */}
                <div className="mb-4">
                  <span className="text-xs text-muted uppercase tracking-wide">Отзыв</span>
                  <p className="text-sm text-muted mt-1 line-clamp-2">
                    {item.review_text}
                  </p>
                </div>

                {/* Response */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted uppercase tracking-wide">Ответ</span>
                    {item.response_accent && (
                      <span className="text-xs px-2 py-0.5 bg-muted-light rounded-full">
                        {accentLabels[item.response_accent] || item.response_accent}
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{item.chosen_response}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted">
                      {new Date(item.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {item.feedback && (
                      <span className={`flex items-center gap-1 text-sm ${
                        item.feedback === 'liked' ? 'text-success' : 'text-danger'
                      }`}>
                        {item.feedback === 'liked' ? (
                          <ThumbsUp className="w-4 h-4" />
                        ) : (
                          <ThumbsDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(item.id, item.chosen_response)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      copiedId === item.id
                        ? 'bg-success text-white'
                        : 'bg-muted-light hover:bg-primary-light hover:text-primary'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Скопировано
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Копировать
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

