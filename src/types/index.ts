// Типы бизнеса
export type BusinessType = 
  | 'restaurant' 
  | 'delivery' 
  | 'cafe' 
  | 'marketplace' 
  | 'service' 
  | 'hotel' 
  | 'other';

// Настройки тона общения
export interface ToneSettings {
  formality: number;    // 0-100: неформальный -> формальный
  empathy: number;      // 0-100: сдержанный -> эмпатичный
  brevity: number;      // 0-100: развёрнутый -> краткий
}

// Правила бизнеса
export interface BusinessRules {
  canApologize: boolean;        // Можно ли извиняться
  canOfferPromocode: boolean;   // Можно ли предлагать промокоды
  canOfferCompensation: boolean; // Можно ли предлагать компенсацию
  canOfferCallback: boolean;    // Можно ли предлагать перезвонить
}

// Профиль бизнеса
export interface Business {
  id: string;
  user_id: string;
  name: string;
  type: BusinessType;
  tone_settings: ToneSettings;
  rules: BusinessRules;
  custom_instructions?: string;
  created_at: string;
  updated_at: string;
}

// Источник отзыва
export type ReviewSource = 
  | 'manual'      // Quick Reply - ручной ввод
  | 'extension'   // Браузерное расширение (будущее)
  | 'api'         // API интеграция (будущее)
  | 'telegram';   // Telegram бот (будущее)

// Статус обработки отзыва
export type ReviewStatus = 
  | 'new'         // Новый, не обработан
  | 'answered'    // Ответ отправлен
  | 'skipped';    // Пропущен

// Отзыв
export interface Review {
  id: string;
  business_id: string;
  source: ReviewSource;
  source_url?: string;
  original_text: string;
  author_name?: string;
  rating?: number;
  review_date?: string;
  status: ReviewStatus;
  chosen_response?: string;
  created_at: string;
}

// Сгенерированный ответ
export interface GeneratedResponse {
  id: string;
  text: string;
  accent: 'neutral' | 'empathetic' | 'solution-focused';
  explanation: string;
}

// История ответов (для памяти)
export interface ResponseHistory {
  id: string;
  business_id: string;
  review_text: string;
  chosen_response: string;
  response_accent?: 'neutral' | 'empathetic' | 'solution-focused';
  feedback?: 'liked' | 'disliked';
  adjustment?: string;
  created_at: string;
}

// Запрос на генерацию ответов
export interface GenerateRequest {
  reviewText: string;
  businessId?: string;
  adjustment?: string; // "мягче", "короче", "без извинений"
}

// Ответ от API генерации
export interface GenerateResponse {
  responses: GeneratedResponse[];
  reviewAnalysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    mainIssue?: string;
    urgency: 'low' | 'medium' | 'high';
  };
}

// Пользовательские данные для онбординга
export interface OnboardingData {
  businessName: string;
  businessType: BusinessType;
  toneSettings: ToneSettings;
  rules: BusinessRules;
}

// =====================
// ПОДПИСКИ И ПЛАТЕЖИ
// =====================

// Тарифные планы
export type PlanType = 'free' | 'start' | 'pro' | 'business';

// Статус подписки
export type SubscriptionStatus = 'active' | 'trialing' | 'cancelled' | 'past_due' | 'expired';

// Лимиты по тарифам
export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 10,
  start: 100,
  pro: 500,
  business: 999999, // безлимит
};

// Цены в копейках
export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  start: 49000,    // 490 ₽
  pro: 99000,      // 990 ₽
  business: 249000, // 2490 ₽
};

// Названия тарифов
export const PLAN_NAMES: Record<PlanType, string> = {
  free: 'Free',
  start: 'Старт',
  pro: 'Про',
  business: 'Бизнес',
};

// Подписка пользователя
export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  usage_count: number;
  usage_limit: number;
  current_period_start: string;
  current_period_end: string;
  trial_start?: string;
  trial_end?: string;
  yukassa_subscription_id?: string;
  cancelled_at?: string;
  cancel_reason?: string;
  created_at: string;
  updated_at: string;
}

// Платёж
export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  yukassa_payment_id?: string;
  payment_method?: string;
  description?: string;
  created_at: string;
}
