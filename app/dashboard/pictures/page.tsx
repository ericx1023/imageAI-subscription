import { auth } from '@clerk/nextjs/server';
import { createClient } from "@supabase/supabase-js";
import GenerateButton from './_components/generate-picture-button';
import PicturesClient from './_components/PicturesClient';
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
  model_name: string;
}

type TrainingsResponse = {
  trainings: Training[];
  next: string | null;
}



export default async function PicturesPage() {
  
  const { userId } = await auth();
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: models } = await supabase.from('trainings')
    .select('replicate_model_id, model_name, base_prompt')
    .eq('user_id', userId);
  //use check_status api to check if the model is ready
  const defaultModel = models?.[0];
  const modelName = defaultModel?.model_name;
  console.log('modelName: ', modelName);
  let training;


  // 預設選擇第一個模型


  const jpgImages = await supabase.storage.from('generated-images').list(userId!);
  //get supabase table user_images's public_url's signedUrl by user_id
  
  const webpImages = await Promise.all(
    jpgImages?.data
      ?.filter(file => file.name.endsWith('.webp'))
      .map(async file => ({ 
        ...file, 
        url: await getImageUrl(file.name) 
      })) ?? []
  );


async function getImageUrl(imageName: string) {
  const { data } = await supabase
    .storage
    .from('generated-images')
    .createSignedUrl(userId! + '/' + imageName, 3600); // 創建一個有效期為1小時的簽名URL
  return data?.signedUrl;
};

  (`webpImages: ${JSON.stringify(webpImages)}`);
  return (
    <div>
      <PicturesClient 
        userId={userId!}
        modelName={modelName} 
        webpImages={webpImages} 
        modelId={defaultModel?.replicate_model_id}
        basePrompt={defaultModel?.base_prompt}
        models={models || []}
    />
    </div>
  );

}
