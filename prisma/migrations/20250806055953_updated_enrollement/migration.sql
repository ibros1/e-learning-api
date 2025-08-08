/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "enrollment" ADD COLUMN     "paymentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_paymentId_key" ON "enrollment"("paymentId");
