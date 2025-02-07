import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { BarChartComponent } from './_components/bar-chart'
import { BarChartBetter } from './_components/bar-chart-better'
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@supabase/supabase-js";
import { clerkClient } from "@clerk/nextjs/server";




export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  
  const { data: user } = await supabase
    .from('user')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (!user) {
    const { error } = await supabase
      .from('user')
      .insert({
        user_id: userId,
        created_time: new Date().toISOString(),
        email: clerkUser.emailAddresses[0]?.emailAddress || 'no-email-provided', // 從 Clerk 取得 email
        subscription: 'free'
      });
    
    if (error) {
      console.error('User creation failed:', error);
    }
  }

  const { data: models } = await supabase.from('trainings')
    .select('replicate_model_id, model_name, base_prompt')
    .eq('user_id', userId);
  //use check_status api to check if the model is ready
  const defaultModel = models?.[0];
  const modelName = defaultModel?.model_name;
  console.log('modelName: ', modelName);
  
  return (
    <div className='flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4'>
        <Card className="">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Latest Models</CardTitle>
              <CardDescription>
                Recent models trained by Gen My Photo
              </CardDescription>
            </div>
            {(models ?? []).length > 0 && (
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/pictures">
                  View Models
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}> {/* Adjust maxHeight according to your design */}
              <main className="flex flex-col gap-2 lg:gap-2 h-[300px] w-full">
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-xl font-bold tracking-tight">
                      You have no models
                    </h1>
                    <p className="text-sm text-muted-foreground mb-3">
                      Train your own model to generate images
                    </p>
                    <Button asChild size="sm" className="mx-auto gap-1">
                      <Link href="/dashboard/train">
                        Train
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </main>
            </div>
          </CardContent>
        </Card>

    </div>
  )
}
