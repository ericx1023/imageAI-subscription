import { auth } from '@clerk/nextjs/server';
import { createClient } from "@supabase/supabase-js";
import GenerateButton from './_components/generate-picture-button';
import PicturesClient from './components/PicturesClient';
export type Training = {
  id: string;
  status: string;
  created_at: string;
  model: string;
  version: string;
  input: Record<string, any>;
  output: Record<string, any>;
  error: string | null;
  logs: string;
  trigger_word: string;
}

type TrainingsResponse = {
  trainings: Training[];
  next: string | null;
}

const replicateApiToken = process.env.REPLICATE_API_TOKEN;


export default async function PicturesPage() {
  
  const { userId } = await auth();
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: models } = await supabase.from('trainings')
    .select('replicate_model_id, model_name, base_prompt')
    .eq('user_id', userId);
  console.log(`models: ${JSON.stringify(models)}`);
  //use check_status api to check if the model is ready
  const defaultModel = models?.[0];
  const modelName = defaultModel?.model_name;

  let training;

  try {
    if (models?.[0]?.model_name) {
      training = await getTrainings(modelName);
    }
  } catch (error) {
    console.error('檢查 Replicate 模型狀態時發生錯誤:', error);
  }

  // 預設選擇第一個模型

  const getImageUrl = async (imageName: string) => {
    const { data } = await supabase
      .storage
      .from('generated-images')
      .createSignedUrl(userId! + '/' + imageName, 3600); // 創建一個有效期為1小時的簽名URL
    return data?.signedUrl;
  };

  const jpgImages = await supabase.storage.from('generated-images').list(userId!);

  const webpImages = await Promise.all(
    jpgImages?.data
      ?.filter(file => file.name.endsWith('.webp'))
      .map(async file => ({ 
        ...file, 
        url: await getImageUrl(file.name) 
      })) ?? []
  );
  console.log(`webpImages: ${JSON.stringify(webpImages)}`);

async function getTrainings(modelName: string): Promise<TrainingsResponse> {
  if (!replicateApiToken) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  const baseUrl = 'https://api.replicate.com/v1/trainings';
  const url = new URL(baseUrl);

  try {
    console.log(`url: ${url.toString()}`);
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Replicate API error: ${error.detail || response.statusText}`);
    }

    const data = await response.json();
    const trainings = data.results.filter((t: Training) => t.input.trigger_word === modelName).filter((t: Training) => t.status === 'succeeded');
    return {
      trainings: trainings,
      next: data.next,
    };
  } catch (error) {
    console.error('Error fetching trainings:', error);
    throw error;
  }
}

  return (
    <PicturesClient 
      userId={userId!}
      modelName={modelName} 
      webpImages={webpImages} 
      modelId={defaultModel?.replicate_model_id}
      basePrompt={defaultModel?.base_prompt}
      trainings={training?.trainings || []}
    />
  );

}
