import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { userId, modelId, modelName, basePrompt } = await req.json();
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  
  const output = await replicate.run(`ericx1023/${modelName}:${modelId}`, {
    input: {
      model: "dev",
      prompt: `${basePrompt}, ${modelName} is wearing a cozy Christmas sweater, standing by the fireplace with stockings and holiday decorations.`,
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
    },
  });

  if (!output) {
    return NextResponse.json({ error: "No output generated" }, { status: 500 });
  }

  const imageUrl = Array.isArray(output) ? output[0] : output;
  
  if (imageUrl instanceof ReadableStream) {
    try {
      // 將 ReadableStream 轉換為 Blob
      const response = new Response(imageUrl);
      const blob = await response.blob();
      
      // 初始化 Supabase 客戶端
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
      );

      // 生成唯一的文件名，確保用戶目錄結構
      const fileName = `${userId}/${Date.now()}.webp`;
      
      // 檢查用戶目錄是否存在，如果不存在則創建
      const { data: existingFiles, error: listError } = await supabase
        .storage
        .from('generated-images')
        .list(userId);

      if (listError && listError.message !== 'The resource was not found') {
        throw listError;
      }

      // 上傳到 Supabase
      const { data, error } = await supabase
        .storage
        .from('generated-images')
        .upload(fileName, blob, {
          contentType: 'image/webp',
          upsert: false
        });

      if (error) throw error;

      // 獲取公開URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('generated-images')
        .getPublicUrl(fileName);

      return NextResponse.json({ imageUrl: publicUrl });
    } catch (error) {
      console.error('Error processing image:', error);
      return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
  }

  return NextResponse.json({ imageUrl: imageUrl.toString() });
}
