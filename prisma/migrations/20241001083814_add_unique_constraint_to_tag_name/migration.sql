/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Tags_Name_key` ON `Tags`(`Name`);
