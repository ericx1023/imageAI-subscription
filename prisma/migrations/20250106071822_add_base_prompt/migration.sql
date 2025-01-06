-- 首先，添加帶有預設值的欄位
ALTER TABLE "trainings" ADD COLUMN "base_prompt" TEXT DEFAULT 'default prompt';

-- 更新現有記錄（如果需要的話）
-- UPDATE "trainings" SET "base_prompt" = 'your_default_value' WHERE "base_prompt" IS NULL;

-- 最後，移除預設值並設置為必需欄位
ALTER TABLE "trainings" ALTER COLUMN "base_prompt" SET NOT NULL,
                        ALTER COLUMN "base_prompt" DROP DEFAULT;