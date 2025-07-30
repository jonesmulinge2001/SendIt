/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class DashboardService {
  private prisma = new PrismaClient();

  // get sent parcels
  async getSentParcels(email: string) {
    return this.prisma.parcel.findMany({
      where: { senderEmail: email, isDeleted: false },
      orderBy: { createdAt: 'asc' },
    });
  }

  // get received parcels
  async getReceivedParcels(email: string) {
    return this.prisma.parcel.findMany({
      where: { receiverEmail: email, isDeleted: false },
      orderBy: { createdAt: 'asc' },
    });
  }

  // get pending pickups (receiver or sender)
  async getPendingPickups(email: string) {
    return this.prisma.parcel.findMany({
      where: {
        isDeleted: false,
        status: 'PENDING',
        OR: [{ senderEmail: email }, { receiverEmail: email }],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getTrackingHistory(parcelId: string) {
    const parcel = await this.prisma.parcel.findUnique({
      where: {
        id: parcelId,
        isDeleted: false,
      },
      include: {
        trackingHistory: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }
    return parcel.trackingHistory;
  }
}
