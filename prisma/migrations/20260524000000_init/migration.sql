CREATE TYPE "ExperienceLevel" AS ENUM ('FRESH_GRADUATE', 'JUNIOR', 'MID_LEVEL', 'SENIOR');
CREATE TYPE "InterviewType" AS ENUM ('GENERAL_HR', 'TECHNICAL', 'BEHAVIORAL', 'FOUNDER', 'MIXED');
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE "SessionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InterviewSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "targetRole" TEXT NOT NULL,
  "experienceLevel" "ExperienceLevel" NOT NULL,
  "jobDescription" TEXT NOT NULL,
  "cvText" TEXT NOT NULL,
  "interviewType" "InterviewType" NOT NULL,
  "contextAnalysis" JSONB,
  "status" "SessionStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InterviewQuestion" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "difficulty" "Difficulty" NOT NULL,
  "whyThisQuestion" TEXT,
  "expectedAnswerFocus" JSONB NOT NULL,
  "order" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InterviewAnswer" (
  "id" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "transcript" TEXT NOT NULL,
  "audioUrl" TEXT,
  "score" DOUBLE PRECISION NOT NULL,
  "feedback" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InterviewAnswer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "InterviewSession_createdAt_idx" ON "InterviewSession"("createdAt");
CREATE INDEX "InterviewQuestion_sessionId_order_idx" ON "InterviewQuestion"("sessionId", "order");
CREATE INDEX "InterviewAnswer_questionId_createdAt_idx" ON "InterviewAnswer"("questionId", "createdAt");

ALTER TABLE "InterviewSession"
  ADD CONSTRAINT "InterviewSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InterviewQuestion"
  ADD CONSTRAINT "InterviewQuestion_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InterviewAnswer"
  ADD CONSTRAINT "InterviewAnswer_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "InterviewQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
