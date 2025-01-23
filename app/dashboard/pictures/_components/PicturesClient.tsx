'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GenerateButton from './generate-picture-button';
import ImageModal from './ImageModal';
import ModelSelector from './ModelSelector';
import { Training } from '../page';
import SelectTheme from './SelectTheme';
import { MODEL_PROMPTS } from '@/app/constants/prompts';
import { Theme } from './SelectTheme';
import ImageGrid from './ImageGrid';

interface PicturesClientProps {
  userId: string;
  modelName?: string;
  webpImages: any[];
  modelId?: string;
  basePrompt?: string;
  finalPrompt?: string;
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
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  let finalPrompt = '';
  const [currentModel, setCurrentModel] = useState({
    replicate_model_id: modelId,
    model_name: modelName,
    base_prompt: basePrompt,
    finalPrompt: undefined as string | undefined
  });

  useEffect(() => {
    setCurrentModel(prev => ({
      ...prev,
      finalPrompt: `${basePrompt}, ${MODEL_PROMPTS.beach({ 
        photoType: 'male',
        age: '25-35',
        eyeColor: 'brown',
        ethnicity: 'asian',
        photos: []
      })}`
    }));
  }, [finalPrompt]);

  const handleModelSelect = (model: any) => {
    setCurrentModel(model);
  };

  const handleView = (image: any) => {
    setSelectedImage(image);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };
  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  const handleEdit = (image: any) => {
    // setSelectedImage(image);
    // setModalMode('edit');
    // setIsModalOpen(true);

  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleThemeSelect = (theme: Theme) => {
    if(theme.id === 'beach') {  
      finalPrompt = `${basePrompt}, ${MODEL_PROMPTS.beach({ 
        photoType: 'male',
        age: '25-35',
        eyeColor: 'brown',
        ethnicity: 'asian',
        photos: []
      })}`
    }
    else {
      finalPrompt = `${basePrompt}, ${MODEL_PROMPTS[theme.id]}`
    }
    
    setCurrentModel(prev => ({
      ...prev,
      finalPrompt
    }));
  };

  return (
    <div>
      <ModelSelector
        trainings={trainings}
        onModelSelect={handleModelSelect}
        defaultModelId={modelId}
      />
      
      <SelectTheme onThemeSelect={handleThemeSelect} />
      
      <GenerateButton
        userId={userId}
        modelId={modelId || ''}
        modelName={modelName!} 
        trainings={trainings}
        basePrompt={basePrompt!}
        finalPrompt={finalPrompt!}
        onImageGenerated={setGeneratedImageUrl}
      />

      <ImageGrid
        images={webpImages}
        onDownload={handleDownload}
        onView={handleView}
        onCopyPrompt={handleCopyPrompt}
        onEdit={handleEdit}
      />

      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        image={selectedImage}
        mode={modalMode}
      />
    </div>
  );
} 