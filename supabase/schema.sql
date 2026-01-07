-- MyReply Database Schema
-- Запустите этот SQL в Supabase SQL Editor

-- Включаем расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- ТАБЛИЦА: businesses
-- Профили бизнесов пользователей
-- =====================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'delivery', 'cafe', 'marketplace', 'service', 'hotel', 'other')),
  tone_settings JSONB NOT NULL DEFAULT '{"formality": 50, "empathy": 50, "brevity": 50}',
  rules JSONB NOT NULL DEFAULT '{"canApologize": true, "canOfferPromocode": false, "canOfferCompensation": false, "canOfferCallback": true}',
  custom_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для быстрого поиска по user_id
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);

-- =====================
-- ТАБЛИЦА: reviews
-- История отзывов (для будущего расширения)
-- =====================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'extension', 'api', 'telegram')),
  source_url TEXT,
  original_text TEXT NOT NULL,
  author_name VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'answered', 'skipped')),
  chosen_response TEXT,
  sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- =====================
-- ТАБЛИЦА: response_history
-- История выбранных ответов (для обучения и памяти)
-- =====================
CREATE TABLE IF NOT EXISTS response_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  review_text TEXT NOT NULL,
  chosen_response TEXT NOT NULL,
  response_accent VARCHAR(30) CHECK (response_accent IN ('neutral', 'empathetic', 'solution-focused')),
  feedback VARCHAR(20) CHECK (feedback IN ('liked', 'disliked')),
  adjustment TEXT, -- "мягче", "короче" и т.д.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_response_history_business_id ON response_history(business_id);
CREATE INDEX IF NOT EXISTS idx_response_history_created_at ON response_history(created_at DESC);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- Пользователи видят только свои данные
-- =====================

-- Включаем RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_history ENABLE ROW LEVEL SECURITY;

-- Политики для businesses
CREATE POLICY "Users can view own businesses" ON businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own businesses" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses" ON businesses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses" ON businesses
  FOR DELETE USING (auth.uid() = user_id);

-- Политики для reviews (через business_id)
CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

-- Политики для response_history (через business_id)
CREATE POLICY "Users can view own response history" ON response_history
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own response history" ON response_history
  FOR INSERT WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

-- =====================
-- ФУНКЦИЯ: auto-update updated_at
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для businesses
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ГОТОВО!
-- =====================
-- Теперь настройте в Supabase Dashboard:
-- 1. Authentication → Email Templates → настройте Magic Link шаблон
-- 2. Authentication → URL Configuration → добавьте Site URL и Redirect URLs

