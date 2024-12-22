import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 處理 webhook 邏輯
  return new NextResponse('OK', { status: 200 });
}


