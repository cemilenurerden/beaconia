-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyRefreshCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastRefreshDate" TIMESTAMP(3);
