import { createClient } from './server';
import type { ResponseHistory } from '@/types';

/**
 * Получить историю ответов для текущего пользователя
 */
export async function getResponseHistory(limit: number = 50): Promise<ResponseHistory[]> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Получаем business_id пользователя
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!business) return [];

  const { data: history, error } = await supabase
    .from('response_history')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !history) return [];

  return history as ResponseHistory[];
}

/**
 * Сохранить ответ в историю
 */
export async function saveResponseToHistory(
  reviewText: string,
  chosenResponse: string,
  responseAccent?: 'neutral' | 'empathetic' | 'solution-focused',
  feedback?: 'liked' | 'disliked',
  adjustment?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Не авторизован' };
  }

  // Получаем business_id пользователя
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return { success: false, error: 'Бизнес не найден. Пройдите онбординг.' };
  }

  const { error } = await supabase
    .from('response_history')
    .insert({
      business_id: business.id,
      review_text: reviewText,
      chosen_response: chosenResponse,
      response_accent: responseAccent,
      feedback,
      adjustment,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Удалить ответ из истории
 */
export async function deleteResponseFromHistory(historyId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Не авторизован' };
  }

  // Получаем business_id пользователя
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!business) {
    return { success: false, error: 'Бизнес не найден' };
  }

  // Удаляем только записи, принадлежащие бизнесу пользователя
  const { error } = await supabase
    .from('response_history')
    .delete()
    .eq('id', historyId)
    .eq('business_id', business.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

