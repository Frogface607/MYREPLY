import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { BusinessType, ToneSettings, BusinessRules } from '@/types';

const VALID_BUSINESS_TYPES: BusinessType[] = [
  'restaurant', 'delivery', 'cafe', 'marketplace', 'service', 'hotel', 'other'
];

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

// GET - получить бизнес-профиль
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Business GET auth error:', authError?.message);
      return NextResponse.json(
        { error: 'Необходима авторизация', detail: authError?.message },
        { status: 401 }
      );
    }

    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // PGRST116 = не найдена запись, это нормально для нового пользователя
      if (error.code === 'PGRST116') {
        return NextResponse.json({ profile: null });
      }
      console.error('Business GET db error:', error.code, error.message, error.details);
      return NextResponse.json({ profile: null });
    }

    if (!business) {
      return NextResponse.json({ profile: null });
    }

    // Парсим metadata если есть
    const metadata = (business.metadata as Record<string, unknown>) || {};
    
    const profile: BusinessProfileData = {
      name: business.name,
      city: metadata.city as string | undefined,
      type: business.type as BusinessType,
      description: (metadata.description as string) || business.custom_instructions?.split('\n\n')[0]?.replace('Описание: ', ''),
      specialties: metadata.specialties as string | undefined,
      commonIssues: (metadata.commonIssues as string[]) || [],
      strengths: (metadata.strengths as string[]) || [],
      tone_settings: business.tone_settings as ToneSettings,
      rules: business.rules as BusinessRules,
      customRules: (metadata.customRules as string) || business.custom_instructions?.split('\n\nОсобые правила: ')[1],
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Business GET exception:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка загрузки' },
      { status: 500 }
    );
  }
}

// POST/PUT - сохранить бизнес-профиль
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Business POST auth error:', authError?.message);
      return NextResponse.json(
        { error: 'Необходима авторизация', detail: authError?.message },
        { status: 401 }
      );
    }

    const data: BusinessProfileData = await request.json();

    // Валидируем тип бизнеса — если не в списке, ставим 'other'
    if (!VALID_BUSINESS_TYPES.includes(data.type)) {
      console.warn(`Invalid business type "${data.type}", falling back to "other"`);
      data.type = 'other';
    }

    // Проверяем, существует ли бизнес
    const { data: existing, error: findError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Business POST find error:', findError.code, findError.message);
    }

    // Базовые данные, которые точно есть в таблице
    const businessData: Record<string, unknown> = {
      name: data.name,
      type: data.type,
      tone_settings: data.tone_settings,
      rules: data.rules,
      custom_instructions: data.description 
        ? `Описание: ${data.description}\n\nЧастые проблемы: ${data.commonIssues?.join(', ') || ''}\n\nСильные стороны: ${data.strengths?.join(', ') || ''}${data.customRules ? `\n\nОсобые правила: ${data.customRules}` : ''}`
        : null,
    };

    // metadata — добавляем только если колонка существует (миграция выполнена)
    const metadataObj = {
      city: data.city,
      description: data.description,
      specialties: data.specialties,
      commonIssues: data.commonIssues || [],
      strengths: data.strengths || [],
      customRules: data.customRules,
    };
    businessData.metadata = metadataObj;

    if (existing) {
      const { error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', existing.id);

      if (error) {
        console.error('Business POST update error:', error.code, error.message, error.details, error.hint);
        // Если ошибка связана с metadata колонкой — пробуем без неё
        if (error.message?.includes('metadata') || error.code === '42703') {
          console.log('Retrying without metadata column...');
          delete businessData.metadata;
          const { error: retryError } = await supabase
            .from('businesses')
            .update(businessData)
            .eq('id', existing.id);
          if (retryError) {
            return NextResponse.json(
              { error: retryError.message, code: retryError.code },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            { error: error.message, code: error.code, hint: error.hint },
            { status: 500 }
          );
        }
      }
    } else {
      const { error } = await supabase
        .from('businesses')
        .insert({
          user_id: user.id,
          ...businessData,
        });

      if (error) {
        console.error('Business POST insert error:', error.code, error.message, error.details, error.hint);
        // Если ошибка связана с metadata колонкой — пробуем без неё
        if (error.message?.includes('metadata') || error.code === '42703') {
          console.log('Retrying insert without metadata column...');
          delete businessData.metadata;
          const { error: retryError } = await supabase
            .from('businesses')
            .insert({
              user_id: user.id,
              ...businessData,
            });
          if (retryError) {
            return NextResponse.json(
              { error: retryError.message, code: retryError.code },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            { error: error.message, code: error.code, hint: error.hint },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Business POST exception:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка сохранения' },
      { status: 500 }
    );
  }
}
