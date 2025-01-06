import { auth } from '@clerk/nextjs/server';
import { createClient } from "@supabase/supabase-js";
import GenerateButton from './_components/generate-picture-button';
import PicturesClient from './components/PicturesClient';
export default async function PicturesPage() {
  const { userId } = await auth();
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: model } = await supabase.from('trainings').select('replicate_model_id, model_name, base_prompt').eq('user_id', userId).single();
  const modelName = model?.model_name;
  //
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

  return (
    <PicturesClient 
      userId={userId!}
      modelName={modelName} 
      webpImages={webpImages} 
      modelId={model?.replicate_model_id}
      basePrompt={model?.base_prompt}
    />
  );

}
