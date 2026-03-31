-- CreateTable
CREATE TABLE "UserFunnelState" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "funnels" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFunnelState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFunnelState_userEmail_key" ON "UserFunnelState"("userEmail");
