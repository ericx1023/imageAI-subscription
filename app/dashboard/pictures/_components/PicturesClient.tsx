'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GenerateButton from './generate-picture-button';
import ImageModal from './ImageModal';
import ModelSelector from './ModelSelector';
import { Training } from '../page';
import SelectTheme from './SelectTheme';
import { getBeachPrompt, MODEL_PROMPTS } from '@/app/constants/prompts';
import { Theme } from '@/app/constants/types/theme';
import ImageGrid from './ImageGrid';
import { PromptProps } from '@/app/constants/types/prompts';
import { themes } from '@/app/constants/themes';
interface PicturesClientProps {
  userId: string;
  modelName?: string;
  webpImages: any[];
  modelId?: string;
  basePrompt?: string;
  finalPrompt?: string;
  models: any[];
}

export default function PicturesClient({
  userId,
  modelName,
  webpImages,
  modelId,
  basePrompt,
  models
}: PicturesClientProps) {
  const [trainings, setTrainings] = useState<Training[]>([]);
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
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    setCurrentModel(prev => ({
      ...prev,
      finalPrompt: `${basePrompt}, ${currentTheme.prompt}`
    }));
  }, [currentTheme]);

  useEffect(() => {
    fetchTrainings(modelName!);
  }, [modelName]);

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
  const fetchTrainings = async (modelName: string) => {
    const response = await fetch(`/api/trainings?modelName=${modelName}`);
    const data = await response.json();
    setTrainings(data);
  };
  const handleThemeSelect = (theme: Theme) => {
    setCurrentTheme(theme);
    
    // if(theme.id === 'beach') {  
    //   finalPrompt = getBeachPrompt(modelParams)
    // }
    // else {
      finalPrompt = `${basePrompt}, ${theme.prompt}`
    // }
    
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
        models={models}
      />
      
      <SelectTheme 
        onThemeSelect={handleThemeSelect}
        selectedTheme={currentTheme}
      />
      
      <GenerateButton
        userId={userId}
        modelId={modelId || ''}
        modelName={modelName!} 
        trainings={trainings}
        basePrompt={currentTheme.prompt!}
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