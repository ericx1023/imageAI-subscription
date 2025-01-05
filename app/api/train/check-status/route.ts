import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelId = searchParams.get('modelId');

  if (!modelId) {
    return NextResponse.json({ error: 'Model ID is required' }, { status: 400 });
  }

  try {
    const replicate = new Replicate();
    const prediction = await replicate.predictions.get(modelId);

    return NextResponse.json({ status: prediction.status });
  } catch (error) {
    console.error('Error checking model status:', error);
    
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json(
      { 
        error: '檢查模型狀態時發生錯誤',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}