import { createClient } from './server';
import type { Business, BusinessType, ToneSettings, BusinessRules } from '@/types';

export interface BusinessProfileData {
  name: string;
  city?: string;
  type: BusinessType;
  description?: string;
  specialties?: string;
  commonIssues?: string[];
  strengths?: string[];
  tone_settings: ToneSettings;
  rules: BusinessRules;
  customRules?: string;
}

/**
 * Получить бизнес-профиль текущего пользователя
 */
export async function getBusinessProfile(): Promise<BusinessProfileData | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !business) return null;

  // Парсим metadata если есть
  const metadata = (business.metadata as any) || {};
  
  return {
    name: business.name,
    city: metadata.city,
    type: business.type as BusinessType,
    description: metadata.description || business.custom_instructions?.split('\n\n')[0]?.replace('Описание: ', ''),
    specialties: metadata.specialties,
    commonIssues: metadata.commonIssues || [],
    strengths: metadata.strengths || [],
    tone_settings: business.tone_settings as ToneSettings,
    rules: business.rules as BusinessRules,
    customRules: metadata.customRules || business.custom_instructions?.split('\n\nОсобые правила: ')[1],
  };
}

/**
 * Сохранить бизнес-профиль
 */
export async function saveBusinessProfile(data: BusinessProfileData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Не авторизован' };
  }

  // Проверяем, существует ли бизнес
  const { data: existing } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const metadata = {
    city: data.city,
    description: data.description,
    specialties: data.specialties,
    commonIssues: data.commonIssues || [],
    strengths: data.strengths || [],
    customRules: data.customRules,
  };

  const businessData = {
    name: data.name,
    type: data.type,
    tone_settings: data.tone_settings,
    rules: data.rules,
    metadata,
    // Сохраняем также в custom_instructions для обратной совместимости
    custom_instructions: data.description 
      ? `Описание: ${data.description}\n\nЧастые проблемы: ${data.commonIssues?.join(', ') || ''}\n\nСильные стороны: ${data.strengths?.join(', ') || ''}${data.customRules ? `\n\nОсобые правила: ${data.customRules}` : ''}`
      : null,
  };

  if (existing) {
    // Обновляем существующий
    const { error } = await supabase
      .from('businesses')
      .update(businessData)
      .eq('id', existing.id);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // Создаём новый
    const { error } = await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        ...businessData,
      });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

