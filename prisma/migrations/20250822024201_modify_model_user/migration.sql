-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false;
