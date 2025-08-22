-- CreateTable
CREATE TABLE "public"."PendingUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "confirmationToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_email_key" ON "public"."PendingUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_confirmationToken_key" ON "public"."PendingUser"("confirmationToken");
