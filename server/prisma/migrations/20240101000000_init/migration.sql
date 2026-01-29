-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('home', 'outdoor', 'any');

-- CreateEnum
CREATE TYPE "Cost" AS ENUM ('free', 'low', 'medium');

-- CreateEnum
CREATE TYPE "Social" AS ENUM ('solo', 'friends', 'both');

-- CreateEnum
CREATE TYPE "Feedback" AS ENUM ('up', 'down', 'retry');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "durationMin" INTEGER NOT NULL,
    "durationMax" INTEGER NOT NULL,
    "energyLevel" "EnergyLevel" NOT NULL,
    "moodTags" TEXT[],
    "location" "Location" NOT NULL,
    "cost" "Cost" NOT NULL,
    "social" "Social" NOT NULL,
    "steps" JSONB NOT NULL,
    "safetyNotes" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inputJson" JSONB NOT NULL,
    "selectedActivityId" TEXT NOT NULL,
    "planBActivityId" TEXT,
    "reason" TEXT NOT NULL,
    "firstStep" TEXT NOT NULL,
    "feedback" "Feedback",
    "feedbackReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DecisionHistory_userId_idx" ON "DecisionHistory"("userId");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_activityId_key" ON "Favorite"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "DecisionHistory" ADD CONSTRAINT "DecisionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionHistory" ADD CONSTRAINT "DecisionHistory_selectedActivityId_fkey" FOREIGN KEY ("selectedActivityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionHistory" ADD CONSTRAINT "DecisionHistory_planBActivityId_fkey" FOREIGN KEY ("planBActivityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
