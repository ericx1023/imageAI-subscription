import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

// 定義請求體的接口
interface GenerateImageRequest {
  userId: string;
  modelId: string;
  versionId: string;
  modelName: string;
  basePrompt: string;
}

// 定義 Replicate 配置接口
interface ReplicateConfig {
  model: string;
  prompt: string;
  go_fast: boolean;
  lora_scale: number;
  megapixels: string;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  guidance_scale: number;
  output_quality: number;
  prompt_strength: number;
  extra_lora_scale: number;
  num_inference_steps: number;
}

// 處理圖片上傳到 Supabase
async function uploadImageToSupabase(
  blob: Blob,
  userId: string,
  modelName: string
) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const fileName = `${userId}/${modelName}/${Date.now()}.webp`;

  const { data, error } = await supabase
    .storage
    .from('generated-images')
    .upload(fileName, blob);

  if (error) throw error;

  const { data: { publicUrl } } = supabase
    .storage
    .from('generated-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

// 從 URL 獲取圖片
async function fetchImageFromUrl(imageUrl: string): Promise<Blob> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return await response.blob();
}

// 處理 ReadableStream
async function streamToBlob(stream: ReadableStream): Promise<Blob> {
  const response = new Response(stream);
  return await response.blob();
}

export async function POST(req: Request) {
  try {
    const { userId, modelId, versionId, modelName, basePrompt } = 
      await req.json() as GenerateImageRequest;

    if (!basePrompt) {
      return NextResponse.json(
        { error: "Base prompt is required" }, 
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const replicateConfig: ReplicateConfig = {
      model: "dev",
      prompt: basePrompt,
      go_fast: true,
      lora_scale: 1,
      megapixels: "1",
      num_outputs: 1,  // 只生成一張圖片
      aspect_ratio: "1:1",
      output_format: "webp",
      guidance_scale: 7,
      output_quality: 90,
      prompt_strength: 0.8,
      extra_lora_scale: 1,
      num_inference_steps: 30,
    };

    const modelPath = `ericx1023/${modelName}:${versionId}` as const;
    console.log('使用模型路徑:', modelPath);
    
    const output = await replicate.run(modelPath, { 
      input: replicateConfig 
    });

    console.log('Replicate API 輸出類型:', output && typeof output);
    
    if (!output || !Array.isArray(output) || !output.length) {
      throw new Error("從 Replicate 沒有收到有效輸出");
    }

    const stream = output[0];
    console.log('處理輸出流...');

    if (!(stream instanceof ReadableStream)) {
      throw new Error("未收到預期的 ReadableStream 格式");
    }

    const imageBlob = await streamToBlob(stream);
    console.log('成功將流轉換為 Blob');

    const publicUrl = await uploadImageToSupabase(imageBlob, userId, modelName);
    console.log('圖片上傳成功:', publicUrl);

    return NextResponse.json({ imageUrl: publicUrl });

  } catch (error: any) {
    console.error('生成圖片時發生錯誤:', error);
    
    return NextResponse.json({ 
      error: error.message || "模型執行失敗",
      details: error.response?.data
    }, { 
      status: error.status || 500 
    });
  }
}
