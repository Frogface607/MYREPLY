'use client';

import { useState } from 'react';
import { Wand2, Send, Loader2 } from 'lucide-react';

interface AdjustmentInputProps {
  onAdjust: (adjustment: string) => void;
  isLoading: boolean;
}

const quickAdjustments = [
  { text: 'Короче', emoji: '✂️' },
  { text: 'Мягче', emoji: '🤗' },
  { text: 'Строже', emoji: '💪' },
  { text: 'Без извинений', emoji: '🚫' },
  { text: 'С промокодом', emoji: '🎁' },
  { text: 'Формальнее', emoji: '👔' },
  { text: 'Проще', emoji: '📝' },
  { text: 'С юмором', emoji: '😊' },
];

export function AdjustmentInput({ onAdjust, isLoading }: AdjustmentInputProps) {
  const [customText, setCustomText] = useState('');

  const handleQuickAdjust = (adjustment: string) => {
    if (!isLoading) {
      onAdjust(adjustment);
    }
  };

  const handleCustomAdjust = () => {
    if (customText.trim() && !isLoading) {
      onAdjust(customText.trim());
      setCustomText('');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wand2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Уточнить ответы</span>
      </div>

      {/* Quick adjustments - always visible */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickAdjustments.map((adj) => (
          <button
            key={adj.text}
            onClick={() => handleQuickAdjust(adj.text)}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm bg-muted-light hover:bg-primary-light hover:text-primary rounded-full transition-all disabled:opacity-50 flex items-center gap-1.5 group"
          >
            <span className="group-hover:scale-110 transition-transform">{adj.emoji}</span>
            {adj.text}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomAdjust()}
          placeholder="Или своё пожелание..."
          className="flex-1 px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all"
          disabled={isLoading}
        />
        <button
          onClick={handleCustomAdjust}
          disabled={!customText.trim() || isLoading}
          className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
