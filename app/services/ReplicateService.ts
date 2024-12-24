import Replicate from 'replicate';
import { SignedUrlData } from '../types/training';

export interface IReplicateService {
  createModel(username: string, modelName: string): Promise<any>;
  createTraining(signedUrl: string, modelName: string): Promise<any>;
}

export class ReplicateService implements IReplicateService {
  private replicate: Replicate;
  
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  async createModel(username: string, modelName: string) {
    return await this.replicate.models.create(username, modelName, {
      visibility: 'private',
      hardware: 'cpu'
    });
  }

  async createTraining(signedUrl: string, modelName: string) {
    
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
          resolution: "512,768,1024",
          autocaption: true,
          input_images: signedUrl,
          trigger_word: modelName,
          learning_rate: 0.0004,
          wandb_project: "flux_train_replicate",
          wandb_save_interval: 100,
          caption_dropout_rate: 0.05,
          cache_latents_to_disk: false,
          wandb_sample_interval: 100
        }
      }
    );
  }
} 