"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import ModelTrainer from "./ModelTrainer"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "名稱必須至少包含2個字元",
  }),
  type: z.string(),
  age: z.string().min(1, { message: "請輸入年齡" }),
  eyeColor: z.string(),
  ethnicity: z.string(),
  consent: z.boolean().refine((val) => val === true, {
    message: "您必須同意條款才能繼續",
  }),
  photos: z.any(),
})

export default function TrainModelPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      consent: false,
      age: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("模型訓練已開始")
    console.log(values)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>歡迎使用 Photo AI!</CardTitle>
          <CardDescription>
            開始創建您的第一個AI人物模型（例如您自己），這將花費約30分鐘，之後您就可以開始使用您自己的AI模型進行第一次拍攝！
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-2">
                您的當前方案還可以建立 1 個AI模型。如需建立更多AI模型，請升級您的方案。
              </p>
            </div>
            
            <CardDescription>
              AI模型是您的AI數位分身。您建立的AI模型是私密的,只有您可以使用。您可以透過上傳自己的照片來建立模型。
              <br />
              建立模��後,系統需要約2小時的時間來訓練您的照片。完成後,我們會寄送電子郵件通知您,
              接著您就可以開始使用您的模型拍攝照片,並嘗試 Image AI 的其他功能,如照片組合和提示詞等。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>您的名稱</FormLabel>
                    <FormDescription>
                      這個名稱將作為您的模型識別詞(Trigger Word)，在生成圖片時使用。<br />
                      建議使用簡單且容易記住的英文名稱，例如 &quot;John Chu&quot; 或 &quot;Mary Wang&quot;。
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="模型名稱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>類型</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m">男性</SelectItem>
                        <SelectItem value="f">女性</SelectItem>
                        <SelectItem value="couple">情侶/兩人</SelectItem>
                        <SelectItem value="dog">狗</SelectItem>
                        <SelectItem value="cat">貓</SelectItem>
                        <SelectItem value="o">其他</SelectItem>
                        <SelectItem value="style">風格</SelectItem>
                        <SelectItem value="product">產品</SelectItem>
                        <SelectItem value="clothing">服裝</SelectItem>
                        <SelectItem value="object">物品</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>年齡</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eyeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>眼睛顏色</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇眼睛顏色" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="black">黑色</SelectItem>
                        <SelectItem value="brown">棕色</SelectItem>
                        <SelectItem value="blue">藍色</SelectItem>
                        <SelectItem value="green">綠色</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>族裔</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇族裔" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="asian">亞洲</SelectItem>
                        <SelectItem value="caucasian">歐洲裔</SelectItem>
                        <SelectItem value="african">非裔</SelectItem>
                        <SelectItem value="hispanic">拉丁裔</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="font-medium">✅ 適合的照片</h3>
                  <p className="text-sm text-muted-foreground">
                    最近的個人照片（只有您自己），包含各種角度的特寫和全身照，在不同場景、服裝下的各種表情（微笑、平靜、傷心等）。
                    請確保照片是最近拍攝的，因為您的外表可能與多年前有所不同。
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">特寫照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">全身照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">側面照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">微笑照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">自然照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">戶外照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">室內照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">正面照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">45度角</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">生活照</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">❌ 不適合的照片</h3>
                  <p className="text-sm text-muted-foreground">
                    請勿使用：Instagram截圖、戴帽子或太陽眼鏡的照片、合照、群組照片、與寵物的合照、
                    濃妝照片、使用濾鏡的照片、姿勢重複的照片、臉部被切掉或不清晰的照片，以及太舊的照片（因為您現在的外表可能已經改變）。
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">IG截圖</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">戴帽照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">太陽眼鏡</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">群組照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">寵物合照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">濃妝照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">濾鏡照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">臉部切掉</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">模糊照</div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">舊照片</div>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        我同意使用條款和隱私政策
                      </FormLabel>
                      <FormDescription>
                        您創建的AI模型是私人的，只能由您使用。
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <ModelTrainer form={form} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
