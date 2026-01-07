'use client';

import { useState } from 'react';
import { ReviewInput } from '@/components/ReviewInput';
import { ResponseCard } from '@/components/ResponseCard';
import { AdjustmentInput } from '@/components/AdjustmentInput';
import type { GeneratedResponse } from '@/types';
import { ArrowLeft, MessageSquareText } from 'lucide-react';
import Link from 'next/link';

interface ReviewAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  mainIssue: string | null;
  urgency: 'low' | 'medium' | 'high';
}

export default function QuickReplyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState<number | undefined>();
  const [responses, setResponses] = useState<GeneratedResponse[]>([]);
  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);

  const handleSubmit = async (text: string, rating?: number) => {
    setIsLoading(true);
    setError(null);
    setReviewText(text);
    setReviewRating(rating);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText: text, rating }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка генерации');
      }

      const data = await res.json();
      setResponses(data.responses);
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustment = async (adjustment: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText,
          adjustment,
          previousResponses: responses,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка генерации');
      }

      const data = await res.json();
      setResponses(data.responses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    // Сохраняем в историю
    try {
      const response = responses.find(r => r.text === text);
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText,
          chosenResponse: text,
          responseAccent: response?.accent,
        }),
      });
    } catch {
      // Не критично, просто логируем
      console.error('Failed to save to history');
    }
  };

  const handleFeedback = async (responseId: string, feedback: 'liked' | 'disliked') => {
    const response = responses.find(r => r.id === responseId);
    if (!response) return;

    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText,
          chosenResponse: response.text,
          responseAccent: response.accent,
          feedback,
        }),
      });
    } catch {
      console.error('Failed to save feedback');
    }
  };

  const handleRegenerate = async (responseId: string) => {
    const response = responses.find(r => r.id === responseId);
    if (!response) return;
    
    await handleAdjustment(`Перегенерируй ${response.accent} вариант, сделай его другим`);
  };

  const sentimentLabels = {
    positive: { label: 'Позитивный', color: 'bg-success-light text-success' },
    neutral: { label: 'Нейтральный', color: 'bg-muted-light text-muted' },
    negative: { label: 'Негативный', color: 'bg-danger-light text-danger' },
  };

  const urgencyLabels = {
    low: { label: 'Низкая', color: 'text-muted' },
    medium: { label: 'Средняя', color: 'text-warning' },
    high: { label: 'Высокая', color: 'text-danger' },
  };

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
            <MessageSquareText className="w-5 h-5 text-primary" />
            <span className="font-semibold">Quick Reply</span>
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Section */}
        <section className="mb-8">
          <ReviewInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </section>

        {/* Results Section */}
        {responses.length > 0 && (
          <section className="animate-fade-in">
            {/* Analysis */}
            {analysis && (
              <div className="bg-card border border-border rounded-xl p-4 mb-6">
                <h3 className="text-sm font-medium mb-3">Анализ отзыва</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Тональность:</span>
                    <span className={`px-2 py-0.5 rounded-full ${sentimentLabels[analysis.sentiment].color}`}>
                      {sentimentLabels[analysis.sentiment].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Срочность:</span>
                    <span className={urgencyLabels[analysis.urgency].color}>
                      {urgencyLabels[analysis.urgency].label}
                    </span>
                  </div>
                  {analysis.mainIssue && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Проблема:</span>
                      <span>{analysis.mainIssue}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Response Cards */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              {responses.map((response, index) => (
                <div 
                  key={response.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ResponseCard
                    response={response}
                    onCopy={handleCopy}
                    onFeedback={handleFeedback}
                    onRegenerate={handleRegenerate}
                  />
                </div>
              ))}
            </div>

            {/* Adjustment */}
            <div className="mt-6">
              <AdjustmentInput
                onAdjust={handleAdjustment}
                isLoading={isLoading}
              />
            </div>

            {/* New Review Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setResponses([]);
                  setAnalysis(null);
                  setReviewText('');
                  setError(null);
                }}
                className="text-primary hover:text-primary-hover font-medium"
              >
                ← Обработать другой отзыв
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

