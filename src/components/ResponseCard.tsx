'use client';

import { useState } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown, RefreshCw, AlertTriangle } from 'lucide-react';
import type { GeneratedResponse } from '@/types';

interface ResponseCardProps {
  response: GeneratedResponse;
  onCopy: (text: string) => void;
  onFeedback: (responseId: string, feedback: 'liked' | 'disliked') => void;
  onRegenerate: (responseId: string, adjustment?: string) => void;
  isSelected?: boolean;
}

const accentLabels: Record<string, { label: string; color: string; icon?: string }> = {
  neutral: { label: 'Нейтральный', color: 'bg-muted-light text-muted' },
  empathetic: { label: 'Эмпатичный', color: 'bg-primary-light text-primary' },
  'solution-focused': { label: 'С решением', color: 'bg-success-light text-success' },
  'passive-aggressive': { label: '🧊 Формально-холодный', color: 'bg-blue-100 text-blue-700' },
  'hardcore': { label: '🔥 Дерзкий', color: 'bg-orange-100 text-orange-700', icon: 'warning' },
};

export function ResponseCard({ 
  response, 
  onCopy, 
  onFeedback, 
  onRegenerate,
  isSelected 
}: ResponseCardProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response.text);
    setCopied(true);
    onCopy(response.text);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'liked' | 'disliked') => {
    setFeedback(type);
    onFeedback(response.id, type);
  };

  const accent = accentLabels[response.accent] || accentLabels.neutral;

  const isHardcore = response.accent === 'hardcore';

  return (
    <div className={`response-card relative group ${isSelected ? 'ring-2 ring-primary' : ''} ${isHardcore ? 'border-orange-300 bg-orange-50/50' : ''}`}>
      {/* Hardcore Warning */}
      {isHardcore && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-orange-100 rounded-lg text-orange-700 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Только для развлечения! Не публикуйте от имени бизнеса.</span>
        </div>
      )}
      
      {/* Accent Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${accent.color}`}>
          {accent.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleFeedback('liked')}
            className={`p-1.5 rounded-lg transition-colors ${
              feedback === 'liked' 
                ? 'bg-success-light text-success' 
                : 'hover:bg-muted-light text-muted'
            }`}
            title="Хороший ответ"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFeedback('disliked')}
            className={`p-1.5 rounded-lg transition-colors ${
              feedback === 'disliked' 
                ? 'bg-danger-light text-danger' 
                : 'hover:bg-muted-light text-muted'
            }`}
            title="Плохой ответ"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Response Text */}
      <p className="text-foreground leading-relaxed mb-4 whitespace-pre-wrap">
        {response.text}
      </p>

      {/* Explanation */}
      {response.explanation && (
        <p className="text-sm text-muted mb-4 italic">
          💡 {response.explanation}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
            copied
              ? 'bg-success text-white'
              : 'bg-primary text-white hover:bg-primary-hover'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Скопировано!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Скопировать
            </>
          )}
        </button>
        <button
          onClick={() => onRegenerate(response.id)}
          className="py-2.5 px-4 border border-border rounded-xl hover:bg-muted-light flex items-center gap-2 transition-colors"
          title="Перегенерировать этот вариант"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

