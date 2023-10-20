/*
  Warnings:

  - You are about to drop the column `content` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `messages` table. All the data in the column will be lost.
  - Added the required column `chatId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "content",
DROP COLUMN "userId",
ADD COLUMN     "chatId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "chat" (
    "id" SERIAL NOT NULL,
    "members" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);
