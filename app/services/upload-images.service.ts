import { createClient } from "@supabase/supabase-js"

  interface UploadResponse {
    result: {
      id: string
      variants: string[]
    }
  }
   
export class UploadImagesService {
    constructor(private userId: string, private modelId: string) {
      this.userId = userId
      this.modelId = modelId
    }


    public async upload (imageUrl: string): Promise<string> {
    console.log('Uploading image to Cloudflare Images:', imageUrl)
   
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()
    const formData = new FormData()
    formData.append('file', imageBlob)

    //upload to supabase bucket: generated-images
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
    //upload image to supabase with userId and modelId
    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(`${this.userId}/${this.modelId}`, imageBlob)  
    if (error) {
      console.error('Failed to upload to Cloudflare Images:', error)
      throw new Error('Failed to upload image')
    }
    return data.path
  } 
}