'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  History, 
  Copy, 
  Check, 
  Trash2,
  MessageSquareText
} from 'lucide-react';

interface HistoryItem {
  id: string;
  review_text: string;
  chosen_response: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('myreply_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('myreply_history', JSON.stringify(newHistory));
  };

  const handleClearAll = () => {
    if (confirm('Очистить всю историю?')) {
      setHistory([]);
      localStorage.removeItem('myreply_history');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/quick-reply"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Назад</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <History className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-muted hover:text-danger transition-colors"
            >
              Очистить
            </button>
          )}
          {history.length === 0 && <div className="w-16" />}
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
              Здесь появятся ответы, которые вы скопировали
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
            <p className="text-sm text-muted mb-4">
              {history.length} {history.length === 1 ? 'ответ' : history.length < 5 ? 'ответа' : 'ответов'} сохранено
            </p>
            
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all group"
              >
                {/* Review */}
                <div className="mb-3">
                  <span className="text-xs text-muted uppercase tracking-wide">Отзыв</span>
                  <p className="text-sm text-muted mt-1 line-clamp-2">
                    {item.review_text}
                  </p>
                </div>

                {/* Response */}
                <div className="mb-4">
                  <span className="text-xs text-muted uppercase tracking-wide">Ваш ответ</span>
                  <p className="mt-1 whitespace-pre-wrap">{item.chosen_response}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted">
                    {formatDate(item.created_at)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-muted hover:text-danger hover:bg-danger-light rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(item.id, item.chosen_response)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        copiedId === item.id
                          ? 'bg-success text-white'
                          : 'bg-primary text-white hover:bg-primary-hover'
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
