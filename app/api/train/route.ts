import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { image_prompt } = await request.json();

    if (!image_prompt || image_prompt.length === 0) {
      return NextResponse.json(
        { error: '沒有提供圖片網址' },
        { status: 400 }
      );
    }

    // 開始 Replicate 訓練
    const input = {
        image_prompt,
        prompt:"",
        prompt_upsampling: true
    };
    
    const callbackURL = process.env.NGROK_URL 
      ? `${process.env.NGROK_URL}/api/webhooks/replicate`
      : `${process.env.FRONTEND_URL}/api/webhooks/replicate`;
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-1.1-pro",
      input: {
        image_prompt: typeof input.image_prompt === 'string' 
          ? encodeURI(input.image_prompt)
          : Array.isArray(input.image_prompt) 
            ? input.image_prompt.map(url => encodeURI(url))
            : '',
        prompt: input.prompt || "",
        prompt_upsampling: input.prompt_upsampling || true,
        num_steps: input.num_steps || 100,
        seed: input.seed || 42,
        guidance_scale: input.guidance_scale || 7.5,
      },
      webhook: callbackURL,
      webhook_events_filter: ["completed"],
    });
    
    return NextResponse.json({ 
      modelId: prediction.id,
      status: prediction.status 
    });

  } catch (error) {
    console.error('訓練錯誤:', error);
    return NextResponse.json(
      { error: '訓練啟動失敗' },
      { status: 500 }
    );
  }
} 