-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "group" TEXT,
ADD COLUMN "tag" TEXT,
ADD COLUMN "estimatedTime" INTEGER,
ADD COLUMN "content" JSONB,
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Resource_status_sortOrder_idx" ON "Resource"("status", "sortOrder");
