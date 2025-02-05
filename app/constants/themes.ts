
import { MODEL_PROMPTS } from "./prompts";
import { Theme } from "./types/theme";

export  const themes: Theme[] = [
    {
      id: 'headshot',
      name: '寵物寫真',
      description: '與可愛小狗互動的溫馨照片',
      prompt: MODEL_PROMPTS.headshot
    },
    {
      id: 'restaurant',
      name: '餐廳美食',
      description: '高級餐廳用餐的精緻場景',
      prompt: MODEL_PROMPTS.restaurant
    },
    {
      id: 'professional',
      name: '專業形象',
      description: '正式商務風格的專業形象照',
      prompt: MODEL_PROMPTS.professional
    },
    {
      id: 'catwalk',
      name: '伸展台',
      description: '時尚伸展台走秀風格',
      prompt: MODEL_PROMPTS.catwalk
    },
    {
      id: 'streetStyle',
      name: '街拍時尚',
      description: '街頭時尚攝影風格',
      prompt: MODEL_PROMPTS.streetStyle
    },
    {
      id: 'beach',
      name: '陽光沙灘排球運動風格',
      description: '陽光沙灘排球運動風格',
      prompt: MODEL_PROMPTS.beach
    },
    {
      id: 'privateJet',
      name: '私人飛機',
      description: '奢華私人飛機內的時尚照',
      prompt: MODEL_PROMPTS.privateJet
    }
  ];