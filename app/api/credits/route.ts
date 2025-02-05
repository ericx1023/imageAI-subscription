import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
//   return NextResponse.json({ credits: user });
//   if (!user) {
//     return NextResponse.json({ error: "未授權" }, { status: 401 });
//   }

  try {
    const { data: credits } = await supabase
      .from('credits')
      .select('amount, used')
      .eq('user_id', userId)
      .single();

    if (!credits) {
      return NextResponse.json({ credits: 0 });
    }

    const availableCredits = credits?.amount - credits?.used;
    return NextResponse.json({ credits: availableCredits });

  } catch (error) {
    console.error('查詢點數時發生錯誤:', error);
    return NextResponse.json({ error: "查詢點數失敗" }, { status: 500 });
  }
}