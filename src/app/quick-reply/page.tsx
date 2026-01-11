'use client';

import { useState, useEffect } from 'react';
import { ReviewInput } from '@/components/ReviewInput';
import { ResponseCard } from '@/components/ResponseCard';
import { AdjustmentInput } from '@/components/AdjustmentInput';
import { ResponseSkeletonGroup } from '@/components/Skeleton';
import type { GeneratedResponse } from '@/types';
import { ArrowLeft, MessageSquareText, Settings, History, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';

interface ReviewAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  mainIssue: string | null;
  urgency: 'low' | 'medium' | 'high';
}

export default function QuickReplyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [responses, setResponses] = useState<GeneratedResponse[]>([]);
  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);
  const [businessSettings, setBusinessSettings] = useState<any>(null);
  const toast = useToast();

  // Загружаем настройки из Supabase
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/business');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setBusinessSettings(data.profile);
          }
        }
      } catch (error) {
        console.error('Error loading business profile:', error);
        // Продолжаем работу без настроек (demo режим)
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (text: string, rating?: number, context?: string, imageBase64?: string) => {
    setIsLoading(true);
    setReviewText(text || '(из скриншота)');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviewText: text, 
          rating, 
          context,
          businessSettings,
          imageBase64
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка генерации');
      }

      const data = await res.json();
      setResponses(data.responses);
      setAnalysis(data.analysis);
      toast.showSuccess('Ответы сгенерированы!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      toast.showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustment = async (adjustment: string) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText,
          adjustment,
          previousResponses: responses,
          businessSettings,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка генерации');
      }

      const data = await res.json();
      setResponses(data.responses);
      toast.showSuccess('Ответы обновлены');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      toast.showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    // Находим accent текущего ответа (если есть)
    const response = responses.find(r => r.text === text);
    const accent = response?.accent;
    
    // Копируем в буфер обмена
    try {
      await navigator.clipboard.writeText(text);
      
      // Сохраняем в историю через API
      try {
        const saveRes = await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewText,
            chosenResponse: text,
            responseAccent: accent,
          }),
        });
        
        if (saveRes.ok) {
          toast.showSuccess('Скопировано и сохранено в историю');
        } else {
          toast.showWarning('Скопировано, но не удалось сохранить в историю');
        }
      } catch (error) {
        toast.showWarning('Скопировано, но не удалось сохранить в историю');
        console.error('Error saving to history:', error);
      }
    } catch (error) {
      toast.showError('Не удалось скопировать текст');
      console.error('Error copying text:', error);
    }
  };

  const handleFeedback = async (responseId: string, feedback: 'liked' | 'disliked') => {
    console.log('Feedback:', responseId, feedback);
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
            href="/"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Главная</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <MessageSquareText className="w-5 h-5 text-primary" />
            <span className="font-semibold">MyReply</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/history"
              className="flex items-center gap-1 text-muted hover:text-foreground transition-colors"
              title="История"
            >
              <History className="w-5 h-5" />
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-1 text-muted hover:text-foreground transition-colors"
              title="Настройки"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Demo Banner */}
        {!businessSettings && (
          <div className="mb-6 p-4 bg-primary-light border border-primary/20 rounded-xl">
            <p className="text-sm">
              <strong>Demo режим:</strong> Настройте профиль бизнеса в{' '}
              <Link href="/settings" className="text-primary underline">Настройках</Link>
              {' '}для более точных ответов.
            </p>
          </div>
        )}

        {/* Input Section */}
        <section className="mb-8">
          <ReviewInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </section>

        {/* Loading Skeleton */}
        {isLoading && responses.length === 0 && (
          <section className="mb-8">
            <ResponseSkeletonGroup />
          </section>
        )}

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
