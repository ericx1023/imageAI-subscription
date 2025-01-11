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
      <select
        value={selectedModelId}
        onChange={handleModelChange}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {trainings.map((training) => (
          <option key={training.id} value={training.id}>
            {training.input.trigger_word}: {training.id}
          </option>
        ))}
      </select>
    </div>
  );
} 