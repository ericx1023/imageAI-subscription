'use client';
import { useState } from 'react';

export default function PicturesPage() {
  // 定義狀態來存儲圖片
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 處理生成圖片的函數
  async function handleGenerateImages() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/generate-picture');
      const base64Images = await response.json();
      
      const images = base64Images.map((base64: string) => {
        return `data:image/jpeg;base64,${base64}`;
      });

      setImages(images);
      
    } catch (error) {
      console.error('生成圖片時發生錯誤:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4">
      <button 
        onClick={handleGenerateImages}
        disabled={isLoading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isLoading ? '生成中...' : '生成圖片'}
      </button>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((imageUrl, index) => (
          <img 
            key={index}
            src={imageUrl} 
            alt={`Generated image ${index + 1}`}
            className="w-full h-auto rounded"
          />
        ))}
      </div>
    </div>
  );
}
