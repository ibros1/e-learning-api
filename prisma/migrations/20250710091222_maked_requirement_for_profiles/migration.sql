/*
  Warnings:

  - Made the column `coverPhoto` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profilePhoto` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "coverPhoto" SET NOT NULL,
ALTER COLUMN "profilePhoto" SET NOT NULL;
