import { createClient } from "@supabase/supabase-js";
import Replicate from 'replicate';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export class TrainingService {
  private replicate: Replicate;
  
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  async createModel(username: string, modelName: string) {
    try {
      // 先檢查模型是否存在
      const existingModel = await this.replicate.models.get(username, modelName);
      return existingModel;
    } catch (error: any) {
      // 如果模型不存在（通常會返回 404），則創建新模型
      if (error?.response?.status === 404) {
        return await this.replicate.models.create(username, modelName, {
          visibility: 'private',
          hardware: 'cpu'
        });
      }
      throw new Error(`模型 ${username}/${modelName} 不存在，系統將嘗試建立新模型`);
    }
  }

  async createTraining(signedUrl: string, body: any) {
    const modelName = body.modelName;
    const age = body.age;
    const eyeColor = body.eyeColor;
    const ethnicity = body.ethnicity;
    const photoType = body.photoType;
    const userId = body.userId;
    const basePrompt = `a photo of a ${ethnicity} ${age} year old ${photoType} with ${eyeColor} eyes`;
    return await this.replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
      {
        destination: `${process.env.REPLICATE_USERNAME}/${modelName}`,
        input: {
          steps: 1000,
          lora_rank: 16,
          optimizer: "adamw8bit",
          batch_size: 1,
          resolution: "1024",
          autocaption: true,
          input_images: signedUrl,
          trigger_word: modelName,
          learning_rate: 0.0004,
          wandb_project: "flux_train_replicate",
          wandb_save_interval: 100,
          caption_dropout_rate: 0.05,
          cache_latents_to_disk: false,
          wandb_sample_interval: 100,
          base_prompt: basePrompt,
          webhook: process.env.NGROK_URL + "/api/webhooks/replicate?userId=${userId}&modelName=${modelName}",
          webhook_events_filter: ["completed", "failed", "started", "logs", "canceled"],
          disable_safety_checker: false
        }
      }
    );
  }

  async createTrainingTable(userId: string, modelId: string, modelName: string, basePrompt: string) {
    const { data, error } = await supabase.from('trainings').insert({
      user_id: userId,
      replicate_model_id: modelId,
      model_name: modelName,
      base_prompt: basePrompt
    });
    if (error) throw error;
    return data;
  }

  // 獲取訓練模型
  public static async getTrainedModel(userId: string, modelId?: string) {
    let query = supabase
      .from("trainings")
      .select("*")
      .eq("user_id", userId);

    if (modelId) {
      const { data, error } = await query
        .eq("replicate_model_id", modelId)
        .single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // 更新訓練模型狀態為完成
  public async updateTrainedModel(userId: string, modelId: string, modelName: string) {
    
    const { error } = await supabase
      .from("trainings")
      .update({
        status: "completed",
        replicate_model_name: modelName,
      })
      .eq("user_id", userId)
      .eq("replicate_model_id", modelId);

    if (error) {
      console.error("更新訓練模型錯誤:", error);
      throw error;
    }
  }
} 


export interface TrainingService {
  createModel(username: string, modelName: string): Promise<any>;
  createTraining(signedUrl: string, body: any): Promise<any>;
  updateTrainedModel(userId: string, modelId: string, modelName: string): Promise<any>;
  getTrainedModel(userId: string, modelId?: string): Promise<any>;
}