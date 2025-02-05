import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

// 定義請求體的接口
interface GenerateImageRequest {
  userId: string;
  modelId: string;
  training: string;
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
  modelId: string
) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const fileName = `${userId}/${modelId}/${Date.now()}.webp`;

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

export async function POST(req: Request) {
  try {
    const { userId, modelId, training, modelName, basePrompt } = 
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
      go_fast: false,
      lora_scale: 1,
      megapixels: "1",
      num_outputs: 4,
      aspect_ratio: "1:1",
      output_format: "webp",
      guidance_scale: 3,
      output_quality: 90,
      prompt_strength: 0.8,
      extra_lora_scale: 1,
      num_inference_steps: 28,
    };

    const modelPath = `${modelName}/${training}` as const;
    const output = await replicate.run(modelPath, { input: replicateConfig });

    if (!output || !Array.isArray(output) || !output.length) {
      throw new Error("No valid output generated from Replicate");
    }

    const imageUrl = output[0];
    if (typeof imageUrl !== 'string') {
      throw new Error("Invalid image URL format");
    }

    const imageBlob = await fetchImageFromUrl(imageUrl);
    const publicUrl = await uploadImageToSupabase(imageBlob, userId, modelId);

    return NextResponse.json({ imageUrl: publicUrl });

  } catch (error: any) {
    console.error('Error in generate-picture:', error);
    
    return NextResponse.json({ 
      error: error.message || "Model execution failed",
      details: error.response?.data
    }, { 
      status: error.status || 500 
    });
  }
}
