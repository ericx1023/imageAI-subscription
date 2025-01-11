import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelId = searchParams.get('modelId');

  if (!modelId) {
    return NextResponse.json(
      { error: '需要提供 modelId' },
      { status: 400 }
    );
  }

  try {
    const replicate = new Replicate();
    const prediction = await replicate.predictions.get(modelId);
    
    return NextResponse.json({ status: prediction.status });
  } catch (error: any) {
    // 如果是 404 錯誤，返回特定的狀態
    if (error?.response?.status === 404) {
      return NextResponse.json({
        status: 'not_found',
        message: '模型訓練尚未開始或已完成'
      });
    }

    // 其他錯誤
    return NextResponse.json({
      error: '檢查模型狀態時發生錯誤',
      details: error.message,
      status: 'error'
    }, { status: 500 });
  }
}