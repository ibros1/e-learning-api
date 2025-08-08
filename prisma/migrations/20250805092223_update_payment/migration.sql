-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_enrollementId_fkey";

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "enrollementId" DROP NOT NULL;
