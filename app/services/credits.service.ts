import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export class CreditsService {
  // 獲取用戶點數
  async getUserCredits(userId: string) {
    const { data, error } = await supabase
      .from("credits")
      .select("amount")
      .eq("user_id", userId)
      .single();
    
    if (error) {
      console.error("取得點數資訊錯誤:", error);
      throw error;
    }
    
    return data;
  }

  // 扣除點數
  async deductCredits(userId: string, amount: number): Promise<number> {
    const credits = await this.getUserCredits(userId);
    
    const { error } = await supabase
      .from("credits")
      .update({ amount: credits.amount - amount })
      .eq("user_id", userId);

    if (error) {
      console.error("更新點數錯誤:", error);
      throw error;
    }

    return credits.amount - amount;
  }
} 