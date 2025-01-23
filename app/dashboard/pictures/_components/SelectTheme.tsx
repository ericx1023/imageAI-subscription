'use client'

import { useState } from 'react';
import { MODEL_PROMPTS } from '@/app/constants/prompts';

export type Theme = {
  id: keyof typeof MODEL_PROMPTS;
  name: string;
  description: string;
};

interface SelectThemeProps {
  onThemeSelect: (theme: Theme) => void;
  defaultTheme?: Theme;
}

const themes: Theme[] = [
  {
    id: 'headshot',
    name: '寵物寫真',
    description: '與可愛小狗互動的溫馨照片'
  },
  {
    id: 'restaurant',
    name: '餐廳美食',
    description: '高級餐廳用餐的精緻場景'
  },
  {
    id: 'professional',
    name: '專業形象',
    description: '正式商務風格的專業形象照'
  },
  {
    id: 'catwalk',
    name: '伸展台',
    description: '時尚伸展台走秀風格'
  },
  {
    id: 'streetStyle',
    name: '街拍時尚',
    description: '街頭時尚攝影風格'
  },
  {
    id: 'beach',
    name: '海灘運動',
    description: '陽光沙灘排球運動風格'
  },
  {
    id: 'privateJet',
    name: '私人飛機',
    description: '奢華私人飛機內的時尚照'
  }
];

export default function SelectTheme({ onThemeSelect, defaultTheme = themes[0] }: SelectThemeProps) {
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);

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
    </div>
  );
} 