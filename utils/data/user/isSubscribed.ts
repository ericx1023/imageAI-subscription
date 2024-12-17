"server only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import config from "@/tailwind.config";

export const isSubscribed = async (
  userId: string
): Promise<{ subscribed: boolean; message: string }> => {
  // 如果付款功能被停用，視為已訂閱
  if (!config?.payments?.enabled) {
    return {
      subscribed: true,
      message: "付款功能已停用",
    };
  }

  // 如果沒有提供 userId，則視為未訂閱
  if (!userId) {
    return {
      subscribed: false,
      message: "未提供使用者 ID",
    };
  }

  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      return {
        subscribed: false,
        message: error.message,
      };
    }

    return {
      subscribed: data?.status === "active",
      message: data?.status === "active" 
        ? "使用者已訂閱" 
        : "使用者未訂閱",
    };
    
  } catch (error: any) {
    return {
      subscribed: false,
      message: error.message,
    };
  }
}; 