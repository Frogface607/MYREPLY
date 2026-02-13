-- Миграция: реферальная система (share-for-bonus)
-- Запустите в Supabase SQL Editor

-- Таблица реферальных ссылок
CREATE TABLE IF NOT EXISTS referral_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL, -- короткий код типа 'abc123'
  clicks INTEGER NOT NULL DEFAULT 0,
  signups INTEGER NOT NULL DEFAULT 0, -- сколько зарегались через эту ссылку
  bonus_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- один реферальный код на пользователя
);

-- Таблица реферальных визитов (для аналитики)
CREATE TABLE IF NOT EXISTS referral_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_code VARCHAR(20) NOT NULL,
  visitor_ip VARCHAR(45), -- для дедупликации
  visitor_fingerprint VARCHAR(64), -- доп. дедупликация
  converted BOOLEAN NOT NULL DEFAULT false, -- зарегался ли
  converted_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица начисленных бонусов
CREATE TABLE IF NOT EXISTS referral_bonuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bonus_type VARCHAR(30) NOT NULL, -- 'extra_responses', 'promo_days'
  bonus_amount INTEGER NOT NULL, -- кол-во ответов или дней
  reason VARCHAR(100), -- 'referral_clicks_3', 'referral_signup'
  applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_referral_links_code ON referral_links(code);
CREATE INDEX IF NOT EXISTS idx_referral_links_user_id ON referral_links(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_visits_code ON referral_visits(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_bonuses_user_id ON referral_bonuses(user_id);

-- RLS
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_bonuses ENABLE ROW LEVEL SECURITY;

-- Пользователь видит только свою реферальную ссылку
CREATE POLICY "Users can view own referral link" ON referral_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own referral link" ON referral_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Визиты — только для сервера (service_role)
CREATE POLICY "Service role can manage visits" ON referral_visits
  FOR ALL USING (true);

-- Бонусы — пользователь видит свои
CREATE POLICY "Users can view own bonuses" ON referral_bonuses
  FOR SELECT USING (auth.uid() = user_id);
