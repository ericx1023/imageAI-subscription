'use client';

interface GenerateButtonProps {
  userId: string;
  modelId: string;
  modelName: string;
  basePrompt: string;
  onImageGenerated: (imageUrl: string) => void;
}

export default function GenerateButton({ userId, modelId, modelName, basePrompt, onImageGenerated }: GenerateButtonProps) {
  async function handleGenerateImages() {
    try {
      const response = await fetch('/api/generate-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, modelId, modelName, basePrompt })
      });
      const data = await response.json();
      console.log(data);
      if(data.imageUrl) {
        onImageGenerated(data.imageUrl);
      }
    //   const uploaded = await fetch('/api/upload', {
    //     method: 'POST',
    //     body: JSON.stringify(data)
    //   });
    //   const uploadedData = await uploaded.json();
    //   console.log(uploadedData);
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