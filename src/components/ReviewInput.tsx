'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Star } from 'lucide-react';

interface ReviewInputProps {
  onSubmit: (reviewText: string, rating?: number, context?: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ReviewInput({ onSubmit, isLoading, error }: ReviewInputProps) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim(), rating || undefined, context.trim() || undefined);
    }
  };

  const placeholderText = `Вставьте текст отзыва сюда...

Например:
"Заказывали пиццу на день рождения. Привезли на час позже обещанного, пицца была уже холодная. Очень разочарованы, испортили праздник."`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="review" className="block text-sm font-medium mb-2">
          Текст отзыва
        </label>
        <textarea
          id="review"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholderText}
          className="review-input"
          rows={6}
          disabled={isLoading}
        />
      </div>

      {/* Rating selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Рейтинг отзыва <span className="text-muted font-normal">(если известен)</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(rating === star ? null : star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-1 transition-transform hover:scale-110"
              disabled={isLoading}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hoverRating || rating || 0)
                    ? 'fill-warning text-warning'
                    : 'text-border hover:text-muted'
                }`}
              />
            </button>
          ))}
          {rating && (
            <span className="ml-3 text-sm text-muted">
              {rating === 1 && '😠 Очень плохо'}
              {rating === 2 && '😕 Плохо'}
              {rating === 3 && '😐 Нормально'}
              {rating === 4 && '🙂 Хорошо'}
              {rating === 5 && '😊 Отлично'}
            </span>
          )}
        </div>
      </div>

      {/* Context / Special instructions */}
      <div>
        {!showContext ? (
          <button
            type="button"
            onClick={() => setShowContext(true)}
            className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
          >
            + Добавить контекст (NEW!)
          </button>
        ) : (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium mb-2">
              Контекст / пожелания <span className="text-muted font-normal">(необязательно)</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Например: клиент постоянный, это повторная жалоба, не предлагать скидку, ответить короче..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-none text-sm"
              rows={2}
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-danger-light text-danger rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Ошибка</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="w-full py-3.5 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Генерируем ответы...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Получить 3 варианта ответа
          </>
        )}
      </button>

      <p className="text-center text-sm text-muted">
        Вставьте отзыв с любой площадки: Яндекс, Google, 2ГИС, Ozon, Wildberries...
      </p>
    </form>
  );
}
