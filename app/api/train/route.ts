import { NextResponse } from 'next/server';
import { ValidationService } from '../../services/ValidationService';
import { ReplicateService } from '../../services/ReplicateService';
import { SignedUrlData, TrainingError } from '../../types/training';

export async function POST(request: Request) {
  const replicateService = new ReplicateService();

  try {
    const formData = await request.formData();
    const signedUrl = formData.get('signedUrl');
    const userId = formData.get('userId');
    let modelName = formData.get('modelName') as string;


    // 驗證輸入
    if (!signedUrl || !userId || !modelName) {
      return createErrorResponse({
        error: '缺少必要參數',
        message: '請提供所有必要參數'
      });
    }

    // 驗證模型名稱
    modelName = ValidationService.formatModelName(modelName);
    if (!ValidationService.isValidModelName(modelName)) {
      return createErrorResponse({
        error: '模型名稱格式無效',
        message: '模型名稱格式不正確'
      });
    }

    // 建立模型和訓練
    const model = await replicateService.createModel(
      process.env.REPLICATE_USERNAME!,
      modelName
    );
    
    const signedUrlString = signedUrl?.toString() || '';
    const training = await replicateService.createTraining(signedUrlString, modelName);

    return NextResponse.json({
      modelId: training.id,
      status: training.status
    });
    
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