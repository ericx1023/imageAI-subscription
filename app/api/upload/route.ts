import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// 建立 Supabase 客戶端時可以設定預設 bucket
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

type UploadResponse = {
  data: {
    path: string       // 檔案在 bucket 中的路徑
    id: string         // 檔案唯一識別碼
    fullPath: string   // 完整路徑，包含 bucket 名稱
    size: number       // 檔案大小（位元組）
    lastModified: Date // 最後修改時間
  }
  error: null         // 成功時為 null
}
interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  stack?: string;
  statusCode?: string;
}

export async function POST(request: Request) {
  try {
    // 檢查 Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: '請求格式錯誤：需要 multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('zipFile');
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

      // 取得 URL
      const signedUrl = await supabase.storage
      .from('training-images')
        .createSignedUrl(filePath, 60 * 60 * 24); // 24小時有效期
      // 在資料庫中記錄檔案資訊（選擇性）
      const { error: dbError } = await supabase
        .from('user_images')
        .insert({
          user_id: userId,
          file_path: filePath,
          public_url: signedUrl,
          original_name: file.name
        });

      if (dbError) {
        throw dbError;
      }

      return {
        data: {
          path: filePath,
          id: fileName,
          fullPath: signedUrl,
          size: file.size,
          lastModified: new Date()
        },
        error: null
      };
    });

    const uploadResponses = await Promise.all(uploadPromises);
    console.log('uploadResponses:', JSON.stringify(uploadResponses, null, 2));
    return NextResponse.json({ 
      urls: uploadResponses.map(response => response.data.fullPath)
    });
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

    if (supabaseError.code === '23503') { // 外鍵約束違反
      return NextResponse.json(
        { error: '使用者不存在', details: supabaseError.message },
        { status: 404 }
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