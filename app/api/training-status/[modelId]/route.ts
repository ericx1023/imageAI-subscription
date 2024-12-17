import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: { modelId: string } }
) {
  try {
    const { modelId } = params;

    if (!modelId) {
      return NextResponse.json(
        { error: '需要提供 modelId' },
        { status: 400 }
      );
    }

    const training = await replicate.trainings.get(modelId);

    return NextResponse.json({
      status: training.status,
      error: training.error
    });

  } catch (error) {
    console.error('狀態檢查錯誤:', error);
    return NextResponse.json(
      { error: '無法獲取訓練狀態' },
      { status: 500 }
    );
  }
} 