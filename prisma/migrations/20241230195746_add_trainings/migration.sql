/*
  Warnings:

  - You are about to drop the column `model_id` on the `model_params` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "model_params" DROP COLUMN "model_id",
ADD COLUMN     "model_name" TEXT;

-- CreateTable
CREATE TABLE "trainings" (
    "id" SERIAL NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "replicate_model_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "model_name" TEXT NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
