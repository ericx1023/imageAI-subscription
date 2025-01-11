'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GenerateButton from '../_components/generate-picture-button';
import ImageModal from './ImageModal';
import ModelSelector from '../_components/ModelSelector';
import { Training } from '../page';

interface PicturesClientProps {
  userId: string;
  modelName?: string;
  webpImages: any[];
  modelId?: string;
  basePrompt?: string;
  trainings: Training[];
}

export default function PicturesClient({
  userId,
  modelName,
  webpImages,
  modelId,
  basePrompt,
  trainings
}: PicturesClientProps) {
  const [currentModel, setCurrentModel] = useState({
    replicate_model_id: modelId,
    model_name: modelName,
    base_prompt: basePrompt
  });

  const handleModelSelect = (model: any) => {
    setCurrentModel(model);
  };

  const handleImageGenerated = (imageUrl: string) => {
    console.log(imageUrl);
  };

  return (
    <div>
      <ModelSelector 
        trainings={trainings}
        onModelSelect={handleModelSelect}
        defaultModelId={modelId}
      />
      <GenerateButton 
        userId={userId}
        modelName={modelName!}
        modelId={currentModel.replicate_model_id!}
        basePrompt={currentModel.base_prompt!}
        onImageGenerated={handleImageGenerated}
      />
      {/* 其他現有的組件內容 */}
    </div>
  );
} 