-- AlterTable
ALTER TABLE "user_skills" ADD COLUMN     "evidenceSummary" TEXT,
ADD COLUMN     "evidenceUrl" TEXT,
ADD COLUMN     "verificationSource" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "project_proofs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "repoUrl" TEXT,
    "liveUrl" TEXT,
    "skillsUsed" TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "metrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_proofs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_proofs" ADD CONSTRAINT "project_proofs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
