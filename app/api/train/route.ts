import { NextResponse } from 'next/server';
import { ValidationService } from '../../services/ValidationService';
import { TrainingService } from '../../services/training.service';
import { SignedUrlData, TrainingError } from '../../types/training';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const trainingService = new TrainingService();
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  try {
    const body = await request.json();
    const { signedUrl, userId, modelName } = body;
    let formattedModelName = modelName as string;

    // 驗證輸入
    if (!signedUrl || !userId || !modelName) {
      return createErrorResponse({
        error: '缺少必要參數',
        message: '請提供所有必要參數'
      });
    }

    // 驗證模型名稱
    formattedModelName = ValidationService.formatModelName(formattedModelName);
    if (!ValidationService.isValidModelName(formattedModelName)) {
      return createErrorResponse({
        error: '模型名稱格式無效',
        message: '模型名稱格式不正確'
      });
    }

    // 建立模型和訓練
    const model = await trainingService.createModel(
      process.env.REPLICATE_USERNAME!,
      formattedModelName
    );
    body.modelName = formattedModelName;
    const training = await trainingService.createTraining(signedUrl, body);

    //if api response is 200, 
    if (training.status === 'processing') {
      //write to supabase
      const {data, error} = await supabase.from('trainings').insert({
        user_id: userId,
        model_id: training.id,
        status: training.status,
        model_name: formattedModelName
      });
      if (error) {
        console.error('寫入訓練資料庫錯誤:', error);
        return createErrorResponse({
          error: '寫入訓練資料庫錯誤',
          message: error instanceof Error ? error.message : '未知錯誤'
        });
      }
      else {
        return NextResponse.json({
          modelId: training.id,
          status: training.status
        });
      }
    }
  } catch (error) {
    console.error('Training API Error:', error);
    return createErrorResponse({
      error: '系統錯誤',
      message: error instanceof Error ? error.message : '未知錯誤'
    });
  }
}

function createErrorResponse(error: TrainingError) {
  return new Response(
    JSON.stringify(error),
    {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    }
  );
} 