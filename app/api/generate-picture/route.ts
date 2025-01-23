import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { userId, modelId, training,modelName, basePrompt, finalPrompt } = await req.json();
    
    // 添加輸入參數的日誌
    console.log('Request parameters:', {
      userId,
      modelId,
      training,
      modelName,
      basePrompt,
      finalPrompt
    });

    if (!basePrompt) {
      return NextResponse.json({ error: "Base prompt is required" }, { status: 400 });
    }
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // 構建模型標識符
    
    const output = await replicate.run(training, {
      input: {
        model: "dev",
        prompt: `${basePrompt}, ${finalPrompt}`,
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
      console.error('No output generated from Replicate');
      return NextResponse.json({ error: "No output generated" }, { status: 500 });
    }

    // 確保 output 是數組並且包含有效的 URL
    const imageUrls = Array.isArray(output) ? output : [output];
    
    if (!imageUrls.length) {
      console.error('No valid image URLs in output');
      return NextResponse.json({ error: "Invalid output format" }, { status: 500 });
    }

    console.log(`imageUrls: ${JSON.stringify(imageUrls)}`);
    const imageUrl = imageUrls[0];
    // 檢查 imageUrl 是否為有效的字符串
    if (typeof imageUrl !== 'string') {
      console.error('Invalid image URL type:', typeof imageUrl);
      return NextResponse.json({ error: "Invalid image URL format" }, { status: 500 });
    }

    try {
      // 從 URL 獲取圖片數據
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
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
        .upload(`${userId}/${modelId}`, blob)  
      
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
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    
    return NextResponse.json({ 
      error: "Model execution failed", 
      details: error.message 
    }, { 
      status: error.status || 500 
    });
  }
}
