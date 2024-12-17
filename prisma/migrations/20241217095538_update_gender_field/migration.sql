/*
  Warnings:

  - You are about to alter the column `gender` on the `User` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `gender` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NULL;
