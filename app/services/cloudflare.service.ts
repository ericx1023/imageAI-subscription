
interface CloudflareEnv {
    CLOUDFLARE_ACCOUNT_ID: string
    CLOUDFLARE_API_TOKEN: string
    CLOUDFLARE_IMAGE_ACCOUNT_HASH: string
    IMAGE_CACHE: KVNamespace
  }
   
  interface UploadResponse {
    result: {
      id: string
      variants: string[]
    }
  }
   
export class CloudflareService {
    private env: CloudflareEnv;
    constructor() {
        this.env = {
            CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID!,
            CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN!
        }
    }
    public async uploadToCloudflareImages (imageUrl: string): Promise<string> {
    console.log('Uploading image to Cloudflare Images:', imageUrl)
   
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()
    const formData = new FormData()
    formData.append('file', imageBlob)
    const uploadResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, 
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`
        },
        body: formData
      }
    )
   
    const result = (await uploadResponse.json()) as UploadResponse
    
    if (!uploadResponse.ok) {
      console.error('Failed to upload to Cloudflare Images:', result)
      throw new Error('Failed to upload image')
    }
   
    console.log('Successfully uploaded to Cloudflare Images:', result)
   
    return result.result.id
  } 
}