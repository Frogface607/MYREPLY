'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle, Star, ImagePlus, X, Camera, Shield, ChevronDown } from 'lucide-react';

interface ReviewInputProps {
  onSubmit: (reviewText: string, rating?: number, context?: string, imageBase64?: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ReviewInput({ onSubmit, isLoading, error }: ReviewInputProps) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Keyboard shortcut: Ctrl+Enter to submit
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if ((text.trim() || image) && !isLoading) {
        onSubmit(text.trim(), rating || undefined, context.trim() || undefined, image || undefined);
      }
    }
  }, [text, image, isLoading, rating, context, onSubmit]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImage(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) handleImageUpload(file);
        break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || image) && !isLoading) {
      onSubmit(text.trim(), rating || undefined, context.trim() || undefined, image || undefined);
    }
  };

  const placeholderText = `Вставьте текст отзыва сюда...

Например:
"Заказывали пиццу на день рождения. Привезли на час позже обещанного, пицца была уже холодная. Очень разочарованы, испортили праздник."`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="relative"
      >
        <label htmlFor="review" className="block text-sm font-medium mb-2">
          Текст отзыва или скриншот
        </label>
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Screenshot" 
              className="max-h-48 rounded-xl border border-border"
            />
            <button
              type="button"
              onClick={() => { setImage(null); setImagePreview(null); }}
              className="absolute -top-2 -right-2 p-1 bg-danger text-white rounded-full hover:bg-danger/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-muted mt-1">
              AI извлечёт текст из скриншота
            </p>
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          id="review"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder={imagePreview ? 'Можете добавить комментарий к скриншоту...' : placeholderText}
          className={`review-input ${isDragging ? 'border-primary bg-primary-light' : ''}`}
          rows={imagePreview ? 3 : 6}
          disabled={isLoading}
          aria-describedby="review-hint"
        />
        
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary-light border-2 border-dashed border-primary rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-primary">Отпустите для загрузки</p>
            </div>
          </div>
        )}
        
        {/* Upload button */}
        {!imagePreview && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-muted hover:text-foreground flex items-center gap-1.5 transition-colors"
              disabled={isLoading}
            >
              <ImagePlus className="w-4 h-4" />
              📷 Скриншот
            </button>
            <span className="text-xs text-muted hidden sm:inline">или перетащите / Ctrl+V</span>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          className="hidden"
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
            <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-muted">
              {rating === 1 && '😠 Плохо'}
              {rating === 2 && '😕 Слабо'}
              {rating === 3 && '😐 Норм'}
              {rating === 4 && '🙂 Хорошо'}
              {rating === 5 && '😊 Супер'}
            </span>
          )}
        </div>
      </div>

      {/* Context — "Расскажите свою правду" */}
      <div>
        <button
          type="button"
          onClick={() => setShowContext(!showContext)}
          className="w-full text-left p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group"
          disabled={isLoading}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Расскажите свою правду</p>
                <p className="text-xs text-muted mt-0.5">AI учтёт вашу версию и не будет извиняться, если вы не виноваты</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${showContext ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {showContext && (
          <div className="mt-3 animate-fade-in">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Например: Гость пришёл за 20 минут до закрытия, заказал сложное блюдо. Предупредили, что ждать дольше — согласился. Потом начал снимать персонал на камеру и провоцировать конфликт..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-none text-sm"
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-muted mt-1.5">
              AI корректно изложит вашу позицию и сохранит профессиональный тон
            </p>
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
        disabled={(!text.trim() && !image) || isLoading}
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

      <p id="review-hint" className="text-center text-sm text-muted">
        Вставьте отзыв с любой площадки: Яндекс, Google, 2ГИС, Ozon, Wildberries...
        <span className="hidden sm:inline"> • Ctrl+Enter для отправки</span>
      </p>
    </form>
  );
}
