'use client';

import Replicate from "replicate";
import { Training } from "../page";

interface GenerateButtonProps {
  userId: string;
  modelId: string;
  modelName: string;
  trainings: Training[];
  basePrompt: string;
  onImageGenerated: (url: string) => void;
  versionId?: string;
}

export default function GenerateButton({ 
  userId,
  modelId, 
  trainings, 
  modelName, 
  basePrompt, 
  onImageGenerated,
  versionId 
}: GenerateButtonProps) {
    
  async function handleGenerateImages() {

    try {

      // 如果沒有 versionId，嘗試從 Replicate API 獲取
        
        if (!versionId) {
          throw new Error('無法獲取模型版本');
        }

      const response = await fetch('/api/generate-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId, 
          modelId, 
          versionId,
          modelName: modelName.trim(),
          basePrompt 
        })
      });
      
      const data = await response.json();
      if(data.imageUrl) {
        onImageGenerated(data.imageUrl);
      }
    } catch (error: any) {
      console.error('生成圖片時發生錯誤:', error);
      alert(error.message);
    }
  }

  return (
    <button 
      onClick={handleGenerateImages}
      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      生成圖片
    </button>
  );
} 