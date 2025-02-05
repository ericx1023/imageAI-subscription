import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { sendEmail } from "@/app/utils/email";
import { createClient } from "@supabase/supabase-js";
import { CreditsService } from "@/app/services/credits.service";
import { TrainingService } from "@/app/services/training.service";
import { GenerateService } from "@/app/services/generate.service";
import { UploadImagesService, uploadAll } from "@/app/services/upload-images.service";
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const creditsService = new CreditsService();
const trainingService = new TrainingService();

const updateCredit = async (userId: string) => {
  await creditsService.deductCredits(userId, 1);
};


export async function POST(req: Request) {
  try {
    // 取得 URL 參數
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const modelName = url.searchParams.get("modelName");
    // 解析 webhook payload
    const payload = await req.json();

    // 檢查狀態是否完成
    if (payload.status === "completed" && userId) {
      // 使用 Clerk 取得用戶資料
      const user = await clerkClient.users.getUser(userId);

      // 從 supabase 取得用戶的點數資訊
      await updateCredit(userId);
      await trainingService.updateTrainedModel(userId, payload.id, modelName!);
      //after training, generate picture for user
      const generateService = new GenerateService();
      const images = await generateService.generateAllPictures(userId, payload.id, modelName!);
      //upload images to cloudflare
      // const uploadImagesService = new UploadImagesService(userId, payload.id);
      const uploadedImages = await uploadAll(userId, payload.id, images);

      ('Uploaded images:', uploadedImages)
      //send email to user

      if (user && user.emailAddresses.length > 0) {
        // 取得用戶的主要電子郵件
        const primaryEmail = user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId
        );

        if (primaryEmail) {
          // 發送電子郵件
          await sendEmail({
            to: primaryEmail.emailAddress,
            subject: "您的模型處理已完成",
            text: "您的模型處理已完成，請登入查看結果。",
          });
        }
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook 處理錯誤:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
