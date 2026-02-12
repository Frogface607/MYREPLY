-- Миграция: система промокодов
-- Запустите в Supabase SQL Editor

-- Таблица промокодов
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  plan VARCHAR(20) NOT NULL DEFAULT 'start',
  duration_days INTEGER NOT NULL DEFAULT 30,
  max_uses INTEGER DEFAULT NULL, -- NULL = безлимитно
  current_uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT NULL, -- NULL = бессрочный
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT, -- для внутреннего использования
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица активаций (кто какой промокод активировал)
CREATE TABLE IF NOT EXISTS promo_activations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id) -- один промокод на одного пользователя
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_activations_user_id ON promo_activations(user_id);

-- RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_activations ENABLE ROW LEVEL SECURITY;

-- Промокоды могут читать все авторизованные (для валидации)
CREATE POLICY "Anyone can read active promo codes" ON promo_codes
  FOR SELECT USING (is_active = true);

-- Активации — пользователь видит только свои
CREATE POLICY "Users can view own activations" ON promo_activations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activations" ON promo_activations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================
-- Первый промокод для акции
-- =====================
INSERT INTO promo_codes (code, plan, duration_days, max_uses, description)
VALUES ('ЖЕСТЬ', 'start', 30, 200, 'Акция «Покажи самый жёсткий отзыв» — 1 месяц Start бесплатно');

INSERT INTO promo_codes (code, plan, duration_days, max_uses, description)
VALUES ('CRINGE', 'start', 30, 200, 'Challenge promo — 1 month Start free');
