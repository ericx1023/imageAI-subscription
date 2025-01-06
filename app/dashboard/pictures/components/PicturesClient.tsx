'use client'

import { useState } from 'react';
import GenerateButton from '../_components/generate-picture-button';

interface PicturesClientProps {
  modelName: string;
  webpImages: any[]; // 請根據實際類型調整
  userId: string;
  modelId: string;
  basePrompt: string;
}

export default function PicturesClient({ userId, modelName, webpImages, modelId, basePrompt }: PicturesClientProps) {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  if (!userId) {
    return null;
  }
  console.log(`webpImages: ${webpImages}`);
  return (
    <div className="p-4">
      {webpImages && webpImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {webpImages.map((image) => (
            <img 
              key={image.id}
              src={image.url}
              alt={image.name}
              className="w-full h-auto rounded"
            />
          ))}
        </div>
      ) : (
        <GenerateButton 
          userId={userId}
          modelId={modelId}
          modelName={modelName}
          basePrompt={basePrompt}
          onImageGenerated={setGeneratedImageUrl}
        />
      )}
    </div>
  );} 