import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// 建立 Supabase 客戶端時可以設定預設 bucket
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  stack?: string;
  statusCode?: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const userId = formData.get('userId'); // 確保從前端傳入 userId

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '沒有找到檔案' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: '未提供使用者 ID' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file: any) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      // 可以根據不同類型的檔案使��不同的 bucket
      const bucket = 'training-images';  // 或是 'private-files', 'public-assets' 等
      const filePath = `${userId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)  // 指定 bucket
        .upload(filePath, file, {
          // 可以設定額外的上傳選項
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // 取得公開 URL
      const { data: { publicUrl } } = supabase.storage
        .from('training-images')
        .getPublicUrl(filePath);

      // 在資料庫中記錄檔案資訊（選擇性）
      const { error: dbError } = await supabase
        .from('user_images')
        .insert({
          user_id: userId,
          file_path: filePath,
          public_url: publicUrl,
          original_name: file.name
        });

      if (dbError) {
        throw dbError;
      }

      return publicUrl;
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls });
  } catch (error: unknown) {
    const supabaseError = error as SupabaseError;
    console.error('上傳錯誤詳情:', {
      message: supabaseError.message,
      code: supabaseError.code,
      details: supabaseError.details,
      stack: supabaseError.stack
    });
    // 根據錯誤類型返回不同的錯誤訊息
    if (supabaseError.statusCode === '23505') { // Supabase 唯一約束衝突
      return NextResponse.json(
        { error: '檔案已存在', details: supabaseError.message },
        { status: 409 }
      );
    }

    if (supabaseError.statusCode === '42P01') { // 資料表不存在
      return NextResponse.json(
        { error: '資料庫設定錯誤', details: supabaseError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: '檔案上傳失敗',
        details: supabaseError.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 