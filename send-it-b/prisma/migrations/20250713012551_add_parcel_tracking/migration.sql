-- CreateTable
CREATE TABLE "ParcelTrackingHistory" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "status" "ParcelStatus" NOT NULL,
    "note" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParcelTrackingHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParcelTrackingHistory" ADD CONSTRAINT "ParcelTrackingHistory_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
