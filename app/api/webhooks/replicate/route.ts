import { NextResponse } from 'next/server';
import { EventEmitter } from 'node:events';

// 建立全域的 EventEmitter 實例
export const webhooks = new EventEmitter();

export async function POST(request: Request) {
  try {
    const prediction = await request.json();

    // 發送預測結果到 EventEmitter
    webhooks.emit(prediction.id, prediction);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook 處理錯誤:', error);
    return NextResponse.json(
      { error: '無法處理 webhook 請求' },
      { status: 500 }
    );
  }
}

// 輔助函數用於等待預測結果
export const waitForPrediction = (predictionId: string) => {
  return new Promise(resolve => {
    webhooks.once(predictionId, resolve);
  });
};


