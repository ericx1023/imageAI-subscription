import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const urls = formData.get('urls');
    const userId = formData.get('userId'); // 確保從前端傳入 userId
    const modelName = formData.get('modelName');
    if (!urls) {
      return new Response('No image prompt provided', { status: 400 });
    }
    
    const callbackURL = process.env.NGROK_URL 
      ? `${process.env.NGROK_URL}/api/webhooks/replicate`
      : `${process.env.FRONTEND_URL}/api/webhooks/replicate`;
      const model = await replicate.models.create(
        process.env.REPLICATE_USERNAME!,
        modelName as string,
        {
          visibility: 'private',
          hardware: 'cpu'
        }   
      )
    const training = await replicate.trainings.create(
        "ostris",
        "flux-dev-lora-trainer",
        "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
        {
          // You need to create a model on Replicate that will be the destination for the trained version.
          destination: `${model.owner}/${modelName}`,  // 修改目標模型格式
          input: {
            steps: 1000,
            lora_rank: 16,
            optimizer: "adamw8bit",
            batch_size: 1,
            resolution: "512,768,1024",
            autocaption: true,
            input_images: urls,
            trigger_word: modelName,
            learning_rate: 0.0004,
            wandb_project: "flux_train_replicate",
            wandb_save_interval: 100,
            caption_dropout_rate: 0.05,
            cache_latents_to_disk: false,
            wandb_sample_interval: 100
          }
        }
      );     
       return NextResponse.json({ 
        modelId: training.id,
        status: training.status 
      });

  } catch (error) {
    console.error('Training API Error:', error);
    // Enter a valid name. This value may contain only lowercase letters, numbers, dashes, underscores, or periods, and may not start or end with a dash, underscore, or period
    // 根據錯誤類型返回不同的錯誤信息
    if (error instanceof Error) {
      return new Response(`錯誤信息: ${error.message}`, { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response('未知錯誤發生', { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 