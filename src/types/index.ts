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

// Типы акцентов ответов
export type ResponseAccent = 
  | 'neutral'           // Нейтральный — сбалансированный
  | 'empathetic'        // Эмпатичный — с пониманием
  | 'solution-focused'  // С решением — конкретные действия
  | 'passive-aggressive' // Формально-холодный — вежливо, но твёрдо
  | 'hardcore';         // Дерзкий — только для развлечения!

// Сгенерированный ответ
export interface GeneratedResponse {
  id: string;
  text: string;
  accent: ResponseAccent;
  explanation: string;
}

// История ответов (для памяти)
export interface ResponseHistory {
  id: string;
  business_id: string;
  review_text: string;
  chosen_response: string;
  response_accent?: ResponseAccent;
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
export type PlanType = 'free' | 'start' | 'pro';

// Статус подписки
export type SubscriptionStatus = 'active' | 'trialing' | 'cancelled' | 'past_due' | 'expired';

// Лимиты по тарифам (ответов в месяц)
export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 5,
  start: 999999,   // безлимит
  pro: 999999,     // безлимит
};

// Цены в копейках
export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  start: 79000,     // 790 ₽
  pro: 199000,      // 1 990 ₽
};

// Названия тарифов
export const PLAN_NAMES: Record<PlanType, string> = {
  free: 'Free',
  start: 'Старт',
  pro: 'Про',
};

// Фичи по тарифам (feature-gated модель)
export const PLAN_FEATURES: Record<PlanType, {
  businessProfile: boolean;
  deepResearch: boolean;
  toneSettings: boolean;
  history: boolean | number; // true = вся, number = последние N, 0 = нет
  chromeExtension: boolean;
  multipleBusinesses: number; // кол-во профилей
  multipleUsers: number;     // кол-во пользователей
  invoicePayment: boolean;   // оплата по счёту
  hardcoreMode: boolean;     // режим Хардкор — доступен всем
  csvExport: boolean;        // экспорт истории в CSV — только Pro
}> = {
  free: {
    businessProfile: false,
    deepResearch: false,
    toneSettings: false,
    history: 0,
    chromeExtension: false,
    multipleBusinesses: 0,
    multipleUsers: 1,
    invoicePayment: false,
    hardcoreMode: true,
    csvExport: false,
  },
  start: {
    businessProfile: true,
    deepResearch: true,
    toneSettings: true,
    history: true,
    chromeExtension: false,
    multipleBusinesses: 1,
    multipleUsers: 1,
    invoicePayment: false,
    hardcoreMode: true,
    csvExport: false,
  },
  pro: {
    businessProfile: true,
    deepResearch: true,
    toneSettings: true,
    history: true,
    chromeExtension: false,
    multipleBusinesses: 5,
    multipleUsers: 3,
    invoicePayment: true,
    hardcoreMode: true,
    csvExport: true,
  },
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