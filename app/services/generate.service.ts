import { MODEL_PROMPTS } from "../constants/prompts";

export interface GenerateService {
  generatePicture(userId: string, modelId: string, modelName: string): Promise<any>;
  generateAllPictures(userId: string, modelId: string, modelName: string): Promise<any[]>;
}

export class GenerateService implements GenerateService {
  public async generatePicture(userId: string, modelId: string, modelName: string): Promise<any> {
    //generate picture
    const response = await fetch('/api/generate-picture', {
      method: 'POST',
      body: JSON.stringify({ userId, modelId, modelName })
    });
    const data = await response.json();
    return data;
  }

  public async generateAllPictures(userId: string, modelId: string, modelName: string): Promise<any[]> {
    // 使用 Promise.all 等待所有請求完成
  const prompts = await Promise.all(
    Object.keys(MODEL_PROMPTS).map(async (key) => {
      const prompt = MODEL_PROMPTS[key as keyof typeof MODEL_PROMPTS];
      const response = await fetch('/api/generate-picture', {
        method: 'POST',
        body: JSON.stringify({ userId, modelId, modelName, prompt })
      });
      return response.json();
    })
  );
    
    return prompts;
  }
}