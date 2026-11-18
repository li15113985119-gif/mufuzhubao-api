-- CreateEnum
CREATE TYPE "CaseVerificationStatus" AS ENUM ('DEMO', 'PENDING_REVIEW', 'VERIFIED');

-- AlterTable
ALTER TABLE "FaultCase" ADD COLUMN     "sourceName" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "verificationStatus" "CaseVerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "verifiedAt" TIMESTAMP(3);
