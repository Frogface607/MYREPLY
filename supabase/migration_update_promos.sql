-- Обновление промокодов: 7 дней вместо 30, увеличенный лимит
-- Запустите в Supabase SQL Editor

-- Обновляем ЖЕСТЬ: 7 дней, лимит 500
UPDATE promo_codes 
SET duration_days = 7, max_uses = 500, description = 'Челлендж MyReply — 7 дней Start бесплатно'
WHERE code = 'ЖЕСТЬ';

-- Обновляем CRINGE: 7 дней, лимит 500
UPDATE promo_codes 
SET duration_days = 7, max_uses = 500, description = 'Challenge promo — 7 days Start free'
WHERE code = 'CRINGE';

-- Добавляем MYREPLY (если ещё нет)
INSERT INTO promo_codes (code, plan, duration_days, max_uses, description)
VALUES ('MYREPLY', 'start', 7, 1000, 'Промо при запуске — 7 дней Start бесплатно')
ON CONFLICT (code) DO UPDATE SET duration_days = 7, max_uses = 1000;
