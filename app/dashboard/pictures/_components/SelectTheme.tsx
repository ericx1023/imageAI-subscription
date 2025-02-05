'use client'

import { useState } from 'react';
import { getBeachPrompt, MODEL_PROMPTS } from '@/app/constants/prompts';
import { themes } from '@/app/constants/themes';
import { Theme } from '@/app/constants/types/theme';


interface SelectThemeProps {
  onThemeSelect: (theme: Theme) => void;
  defaultTheme?: Theme;
  selectedTheme?: Theme;
}


export default function SelectTheme({ 
  onThemeSelect, 
  defaultTheme = themes[0],
  selectedTheme: propSelectedTheme
}: SelectThemeProps) {
  const [selectedTheme, setSelectedTheme] = useState(propSelectedTheme || defaultTheme);

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    onThemeSelect(theme);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">選擇風格</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme)}
            className={`p-4 rounded-lg border transition-all ${
              selectedTheme === theme
                ? 'border-blue-500 bg-blue-50 text-gray-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <h4 className="font-medium">{theme.name}</h4>
              <p className="text-sm text-gray-500">{theme.description}</p>
            </div>
          </button>
        ))}
      </div>
      {/* show the prompt */}
      <div className="mt-4">
        <h4 className="font-medium">Prompt</h4>
        <textarea 
          className="w-full text-sm text-white p-2 border rounded"
          value={selectedTheme?.prompt}
          rows={5}
          onChange={(e) => {
            if (selectedTheme) {
              setSelectedTheme({
                ...selectedTheme,
                prompt: e.target.value
              });
              onThemeSelect({
                ...selectedTheme,
                prompt: e.target.value
              });
            }
          }}
        />
      </div>
    </div>
  );
} 