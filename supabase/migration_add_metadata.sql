-- Миграция: добавление поля metadata в таблицу businesses
-- Запустите этот SQL в Supabase SQL Editor после основной схемы

-- Добавляем JSONB поле для хранения дополнительных данных бизнеса
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Создаём индекс для быстрых поисков по metadata (опционально)
CREATE INDEX IF NOT EXISTS idx_businesses_metadata ON businesses USING GIN (metadata);

-- Комментарий к полю
COMMENT ON COLUMN businesses.metadata IS 'Дополнительные данные: city, description, specialties, commonIssues, strengths';

