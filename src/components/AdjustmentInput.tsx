'use client';

import { useState } from 'react';
import { Wand2, X } from 'lucide-react';

interface AdjustmentInputProps {
  onAdjust: (adjustment: string) => void;
  isLoading: boolean;
}

const quickAdjustments = [
  'Короче',
  'Мягче',
  'Строже',
  'Без извинений',
  'С промокодом',
  'Более формально',
];

export function AdjustmentInput({ onAdjust, isLoading }: AdjustmentInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const handleQuickAdjust = (adjustment: string) => {
    onAdjust(adjustment);
    setIsOpen(false);
  };

  const handleCustomAdjust = () => {
    if (customText.trim()) {
      onAdjust(customText.trim());
      setCustomText('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <Wand2 className="w-4 h-4" />
        Уточнить пожелание
      </button>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Как изменить ответы?</span>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-muted-light rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-muted" />
        </button>
      </div>

      {/* Quick adjustments */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickAdjustments.map((adj) => (
          <button
            key={adj}
            onClick={() => handleQuickAdjust(adj)}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm bg-muted-light hover:bg-primary-light hover:text-primary rounded-full transition-colors disabled:opacity-50"
          >
            {adj}
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
          placeholder="Или напишите своё..."
          className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleCustomAdjust}
          disabled={!customText.trim() || isLoading}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          Применить
        </button>
      </div>
    </div>
  );
}

