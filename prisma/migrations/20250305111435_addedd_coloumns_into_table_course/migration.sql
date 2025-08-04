/*
  Warnings:

  - Added the required column `course_img` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preview_course_url` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "course_img" TEXT NOT NULL,
ADD COLUMN     "cover_img" TEXT,
ADD COLUMN     "preview_course_url" TEXT NOT NULL;
