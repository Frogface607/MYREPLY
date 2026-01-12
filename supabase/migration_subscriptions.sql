-- MyReply Subscriptions Migration
-- Запустите этот SQL в Supabase SQL Editor

-- =====================
-- ТАБЛИЦА: subscriptions
-- Подписки пользователей
-- =====================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Тариф: free, start, pro, business
  plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'start', 'pro', 'business')),
  
  -- Статус подписки
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'cancelled', 'past_due', 'expired')),
  
  -- Лимиты использования
  usage_count INTEGER NOT NULL DEFAULT 0,        -- Сколько ответов использовано в текущем периоде
  usage_limit INTEGER NOT NULL DEFAULT 10,       -- Лимит ответов в периоде (10 для free)
  
  -- Период подписки
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month'),
  
  -- Пробный период
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- ЮKassa данные
  yukassa_subscription_id VARCHAR(255),
  yukassa_payment_method_id VARCHAR(255),
  
  -- Метаданные
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Один пользователь = одна подписка
  UNIQUE(user_id)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);

-- =====================
-- ТАБЛИЦА: payments
-- История платежей
-- =====================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Сумма и валюта
  amount INTEGER NOT NULL,           -- В копейках (49000 = 490 рублей)
  currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
  
  -- Статус платежа
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  
  -- ЮKassa данные
  yukassa_payment_id VARCHAR(255),
  yukassa_status VARCHAR(50),
  payment_method VARCHAR(50),        -- bank_card, yoo_money, sbp и т.д.
  
  -- Описание
  description TEXT,
  
  -- Метаданные
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_yukassa_id ON payments(yukassa_payment_id);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================

-- Включаем RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Политики для subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Политики для payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- =====================
-- ФУНКЦИЯ: Создать подписку для нового пользователя
-- =====================
CREATE OR REPLACE FUNCTION create_subscription_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan, status, usage_limit)
  VALUES (NEW.id, 'free', 'trialing', 100)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Устанавливаем 7-дневный trial
  UPDATE subscriptions 
  SET 
    trial_start = NOW(),
    trial_end = NOW() + INTERVAL '7 days',
    status = 'trialing'
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания подписки
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_subscription_for_new_user();

-- =====================
-- ФУНКЦИЯ: Сбросить usage_count в начале нового периода
-- =====================
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE subscriptions
  SET 
    usage_count = 0,
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '1 month',
    updated_at = NOW()
  WHERE current_period_end < NOW()
    AND status IN ('active', 'trialing');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- ФУНКЦИЯ: Проверить и обновить статус trial
-- =====================
CREATE OR REPLACE FUNCTION check_trial_expiration()
RETURNS void AS $$
BEGIN
  UPDATE subscriptions
  SET 
    status = 'active',
    plan = 'free',
    usage_limit = 10,
    usage_count = 0,
    updated_at = NOW()
  WHERE status = 'trialing'
    AND trial_end < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ЛИМИТЫ ПО ТАРИФАМ (для справки):
-- free: 10 ответов/мес
-- start: 100 ответов/мес (490 ₽)
-- pro: 500 ответов/мес (990 ₽)
-- business: 999999 (безлимит) (2490 ₽)
-- =====================
