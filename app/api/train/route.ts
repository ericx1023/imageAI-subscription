import { NextResponse } from "next/server";
import { ValidationService } from "../../services/ValidationService";
import { TrainingService } from "../../services/training.service";
import { SignedUrlData, TrainingError } from "../../types/training";
import { createClient } from "@supabase/supabase-js";
import { CreditsService } from "@/app/services/credits.service";
import { currentUser } from "@clerk/nextjs";

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
};

type TrainingsResponse = {
  trainings: Training[];
  next: string | null;
};

function createErrorResponse(error: TrainingError) {
  return new Response(JSON.stringify(error), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
async function getTrainings(modelName: string): Promise<TrainingsResponse> {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateApiToken) {
    throw new Error("REPLICATE_API_TOKEN is not set");
  }

  const baseUrl = "https://api.replicate.com/v1/trainings";
  const url = new URL(baseUrl);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Token ${replicateApiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Replicate API error: ${error.detail || response.statusText}`
      );
    }

    const data = await response.json();
    const trainings = data.results
      .filter((t: Training) => t.input.trigger_word === 'model')
      .filter((t: Training) => t.status === "succeeded");
    return {
      trainings: trainings,
      next: data.next,
    };
  } catch (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  const trainingService = new TrainingService();
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  try {
    const body = await request.json();
    const { signedUrl, userId, modelName, basePrompt } = body;
    let formattedModelName = modelName as string;
    // const basePrompt = `a photo of a ${ethnicity} ${age} year old ${photoType} with ${eyeColor} eyes`;

    // 驗證輸入
    if (!signedUrl || !userId || !modelName) {
      return createErrorResponse({
        error: "缺少必要參數",
        message: "請提供所有必要參數",
      });
    }

    // 驗證模型名稱
    formattedModelName = ValidationService.formatModelName(formattedModelName);
    if (!ValidationService.isValidModelName(formattedModelName)) {
      return createErrorResponse({
        error: "模型名稱格式無效",
        message: "模型名稱格式不正確",
      });
    }

    // 建立模型和訓練
    const model = await trainingService.createModel(
      process.env.REPLICATE_USERNAME!,
      formattedModelName
    );
    body.modelName = formattedModelName;
    const training = await trainingService.createTraining(signedUrl, body);

    // 檢查訓練狀態並返回適當的響應
    if (training.status === "processing" || training.status === "starting") {
      const { data, error } = await supabase.from("trainings").insert({
        user_id: userId,
        replicate_model_id: training.id,
        status: training.status,
        model_name: formattedModelName,
        base_prompt: basePrompt,
        replicate_model_version_id: training.version_id,
      });

      if (error) {
        console.error("寫入訓練資料庫錯誤:", error);
        return createErrorResponse({
          error: "寫入訓練資料庫錯誤",
          message: error instanceof Error ? error.message : "未知錯誤",
        });
      }
      //credit service to deduct credits
      const creditService = new CreditsService();
      try {
        const remainingCredits = await creditService.deductCredits(userId, 1);
        `扣除點數成功，剩餘點數: ${remainingCredits}`;

        return NextResponse.json({
          modelId: training.id,
          status: training.status,
          remainingCredits: remainingCredits,
        });
      } catch (error) {
        console.error("扣除點數錯誤:", error);
        return createErrorResponse({
          error: "扣除點數錯誤",
          message: error instanceof Error ? error.message : "未知錯誤",
        });
      }
    } else {
      // 當訓練狀態不是 'processing' 時返回錯誤響應
      return createErrorResponse({
        error: "訓練狀態異常",
        message: `訓練狀態為: ${training.status}`,
      });
    }
  } catch (error) {
    console.error("Training API Error:", error);
    return createErrorResponse({
      error: "系統錯誤",
      message: error instanceof Error ? error.message : "未知錯誤",
    });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trainingId = searchParams.get('trainingId');
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  if (!trainingId) {
    return createErrorResponse({
      error: "缺少訓練ID",
      message: "請提供訓練ID",
    });
  }

  if (!replicateApiToken) {
    return createErrorResponse({
      error: "API Token未設定",
      message: "系統配置錯誤",
    });
  }

  try {
    const response = await fetch(`https://api.replicate.com/v1/trainings/${trainingId}`, {
      headers: {
        Authorization: `Token ${replicateApiToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Replicate API error: ${error.detail || response.statusText}`);
    }

    const data = await response.json();
    
    // 更新資料庫中的訓練狀態
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { error: updateError } = await supabase
      .from("trainings")
      .update({ status: data.status })
      .eq("replicate_model_id", trainingId);

    if (updateError) {
      console.error("更新訓練狀態錯誤:", updateError);
    }

    return NextResponse.json({
      status: data.status,
      modelVersion: data.version,
      error: data.error,
      logs: data.logs
    });
  } catch (error) {
    console.error("檢查訓練狀態錯誤:", error);
    return createErrorResponse({
      error: "檢查訓練狀態失敗",
      message: error instanceof Error ? error.message : "未知錯誤",
    });
  }
}
