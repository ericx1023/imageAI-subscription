'use client';

import { Training } from "../page";

interface GenerateButtonProps {
  userId: string;
  modelId: string;
  modelName: string;
  trainings: Training[];
  basePrompt: string;
  onImageGenerated: (url: string) => void;
}

export default function GenerateButton({ userId,modelId, trainings, modelName, basePrompt, onImageGenerated }: GenerateButtonProps) {
  async function handleGenerateImages() {
    try {
      const response = await fetch('/api/generate-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, modelId, training: trainings[0].output.version, modelName, basePrompt })
      });
      const data = await response.json();
      (data);
      if(data.imageUrl) {
        onImageGenerated(data.imageUrl);
      }
    //   const uploaded = await fetch('/api/upload', {
    //     method: 'POST',
    //     body: JSON.stringify(data)
    //   });
    //   const uploadedData = await uploaded.json();
    //   (uploadedData);
    } catch (error) {
      console.error('生成圖片時發生錯誤:', error);
    }
  }

  return (
    <button 
      onClick={handleGenerateImages}
      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      生成圖片
    </button>
  );
} 