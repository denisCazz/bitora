-- CreateTable
CREATE TABLE "EditorialRunEvent" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditorialRunEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EditorialRunEvent_runId_createdAt_idx" ON "EditorialRunEvent"("runId", "createdAt");

-- CreateIndex
CREATE INDEX "EditorialRun_triggeredBy_startedAt_idx" ON "EditorialRun"("triggeredBy", "startedAt");

-- AddForeignKey
ALTER TABLE "EditorialRunEvent" ADD CONSTRAINT "EditorialRunEvent_runId_fkey" FOREIGN KEY ("runId") REFERENCES "EditorialRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
