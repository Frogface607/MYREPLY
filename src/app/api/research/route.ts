import { NextRequest, NextResponse } from 'next/server';
import { researchBusiness } from '@/lib/tavily';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, city } = body;

    if (!businessName || !city) {
      return NextResponse.json(
        { error: 'Название бизнеса и город обязательны' },
        { status: 400 }
      );
    }

    // Запускаем research
    const insights = await researchBusiness(businessName, city);

    return NextResponse.json({
      success: true,
      insights: {
        description: insights.description,
        businessType: insights.businessType,
        commonIssues: insights.commonIssues,
        strengths: insights.strengths,
        recommendedTone: insights.recommendedTone,
        competitorInsights: insights.competitorInsights,
        summary: insights.summary,
      },
      sourcesCount: insights.searchResults.length,
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка исследования' },
      { status: 500 }
    );
  }
}

