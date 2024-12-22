import { NextResponse } from 'next/server';
import { EventEmitter } from 'node:events';

// 建立全域的 EventEmitter 實例
export const webhooks = new EventEmitter();

export async function POST(req: Request) {
  // 處理 webhook 邏輯
  return new Response('OK', { status: 200 });
}

// 輔助函數用於等待預測結果
export const waitForPrediction = (predictionId: string) => {
  return new Promise(resolve => {
    webhooks.once(predictionId, resolve);
  });
};


