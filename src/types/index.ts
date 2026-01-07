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

