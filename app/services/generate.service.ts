
export interface GenerateService {
  generatePicture(userId: string, modelId: string, modelName: string): Promise<any>;
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
}