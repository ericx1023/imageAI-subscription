import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const modelName = searchParams.get('modelName');

    if (!modelName) {
      return NextResponse.json(
        { error: '缺少 modelName 參數' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { data: trainings, error } = await supabase
      .from('trainings')
      .select('id, model_name, base_prompt, version_id, created_time, status')
      .eq('model_name', modelName);

    if (error) {
      console.error('[TrainingsAPI] Supabase 錯誤:', error);
      return NextResponse.json(
        { error: '資料庫查詢錯誤' },
        { status: 500 }
      );
    }

    // 轉換資料格式以符合前端期望
    const formattedTrainings = trainings.map(training => ({
      id: training.id,
      model_name: training.model_name,
      base_prompt: training.base_prompt,
      output: {
        version: training.version_id
      },
      created_at: training.created_time
    }));

    return NextResponse.json(formattedTrainings);
    
  } catch (error) {
    console.error('[TrainingsAPI] 錯誤:', error);
    return NextResponse.json(
      { error: '內部伺服器錯誤' },
      { status: 500 }
    );
  }
} 