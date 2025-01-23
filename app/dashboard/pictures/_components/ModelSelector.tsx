'use client';

import { useState } from 'react';
import { Training } from '../page';

interface ModelSelectorProps {
  trainings: Training[];
  onModelSelect: (model: Training) => void;
  defaultModelId?: string;
}

export default function ModelSelector({ 
    trainings, 
  onModelSelect,
  defaultModelId 
}: ModelSelectorProps) {
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId || trainings[0]?.id);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = trainings.find(m => m.id === e.target.value);
    if (selectedModel) {
      setSelectedModelId(selectedModel.id);
      onModelSelect(selectedModel);
    }
  };
  console.log(trainings)
  return (
    <div className="w-full max-w-xs mb-4">
      <div className="flex items-center gap-4">
        <label htmlFor="model-selector" className="text-sm font-medium text-white whitespace-nowrap">
          Select Model
        </label>
        <select
          id="model-selector"
          value={selectedModelId}
          onChange={handleModelChange}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-transparent"
        >
          {trainings.map((training) => (
            <option key={training.id} value={training.id}>
              {training.input.trigger_word}: {training.id}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 