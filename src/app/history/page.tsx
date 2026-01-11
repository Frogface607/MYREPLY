'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  History, 
  Copy, 
  Check, 
  Trash2,
  MessageSquareText,
  Sparkles,
  Download,
  Loader2
} from 'lucide-react';
import type { ResponseHistory } from '@/types';
import { useToast } from '@/components/ToastProvider';
import { Dialog } from '@/components/Dialog';

export default function HistoryPage() {
  const [history, setHistory] = useState<ResponseHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/history');
        if (!res.ok) throw new Error('Failed to load history');
        const data = await res.json();
        setHistory(data.history || []);
      } catch (error) {
        console.error('Error loading history:', error);
        toast.showError('Не удалось загрузить историю');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.showSuccess('Скопировано в буфер обмена');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.showError('Не удалось скопировать текст');
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setDeletingId(itemToDelete);
    try {
      const res = await fetch(`/api/history?id=${itemToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setHistory(history.filter(h => h.id !== itemToDelete));
        toast.showSuccess('Ответ удалён из истории');
      } else {
        toast.showError('Ошибка удаления: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast.showError('Ошибка удаления');
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleClearAll = () => {
    toast.showInfo('Функция массового удаления пока недоступна. Удаляйте записи по одной.');
  };

  const handleExport = () => {
    if (history.length === 0) {
      toast.showWarning('Нет данных для экспорта');
      return;
    }
    
    try {
      const content = history.map(item => {
        const date = new Date(item.created_at).toLocaleString('ru-RU');
        return `---\nДата: ${date}\n\nОтзыв:\n${item.review_text}\n\nОтвет:\n${item.chosen_response}\n`;
      }).join('\n');
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `myreply-history-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.showSuccess('История экспортирована');
    } catch (error) {
      toast.showError('Ошибка при экспорте истории');
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
          {history.length > 0 ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="p-2 text-muted hover:text-foreground hover:bg-muted-light rounded-lg transition-all"
                title="Экспорт"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearAll}
                className="text-sm text-muted hover:text-danger transition-colors"
              >
                Очистить
              </button>
            </div>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquareText className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">История пуста</h2>
            <p className="text-muted mb-2 max-w-md mx-auto">
              Здесь появятся ответы, которые вы скопировали.
            </p>
            <p className="text-sm text-muted mb-8">
              Это удобно — можно использовать удачные формулировки повторно.
            </p>
            <Link
              href="/quick-reply"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-medium"
            >
              <Sparkles className="w-5 h-5" />
              Создать первый ответ
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary">{history.length}</div>
                <div className="text-sm text-muted">
                  {history.length === 1 ? 'ответ' : history.length < 5 ? 'ответа' : 'ответов'}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-success">
                  {Math.round(history.reduce((acc, h) => acc + h.chosen_response.length, 0) / history.length)}
                </div>
                <div className="text-sm text-muted">символов в среднем</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center hidden sm:block">
                <div className="text-2xl font-bold text-foreground">
                  ~{Math.round(history.length * 5)}
                </div>
                <div className="text-sm text-muted">минут сэкономлено</div>
              </div>
            </div>

            <p className="text-sm text-muted">
              История синхронизируется между устройствами
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
                      onClick={() => handleDeleteClick(item.id)}
                      disabled={deletingId === item.id}
                      className="p-2 text-muted hover:text-danger hover:bg-danger-light rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      title="Удалить"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        title="Удалить ответ?"
        message="Это действие нельзя отменить. Ответ будет удалён из истории."
        type="confirm"
        variant="danger"
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
