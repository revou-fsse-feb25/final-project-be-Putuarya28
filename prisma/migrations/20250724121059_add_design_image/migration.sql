-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "notes" TEXT,
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "DesignImage" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignImage_pkey" PRIMARY KEY ("id")
);
