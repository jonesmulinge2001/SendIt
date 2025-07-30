/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ParcelStatus, PrismaClient } from 'generated/prisma';
import { SendItMailerService } from 'src/shared/mailer/mailer.service';

@Injectable()
export class DriverService {
private prisma = new PrismaClient();
    constructor(private readonly sendItMailerService: SendItMailerService){}
  
  async getParcelByDriver(driverId: string) {
    return this.prisma.parcel.findMany({
      where: {
        driverId: driverId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateParcelStatus(id: string, status: ParcelStatus) {
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel || parcel.isDeleted)
      throw new NotFoundException(`Parcel with ID ${id} not found or deleted`);

    const updated = await this.prisma.parcel.update({
      where: { id },
      data: { status },
    });

    const statusMessage =
      {
        PENDING: 'Your parcel is pending.',
        IN_TRANSIT: 'Your parcel is now in transit.',
        DELIVERED: 'Your parcel has been delivered!',
        CANCELLED: 'Your parcel was cancelled.',
      }[status] || 'Parcel status updated.';

    // await this.addTrackingEntry(parcel.id, 'SYSTEM', statusMessage);

    await this.sendItMailerService.sendEmail({
      to: parcel.senderEmail,
      subject: `Parcel Status Updated`,
      template: 'parcel-status-sender',
      context: {
        senderName: parcel.senderName,
        title: parcel.title,
        status: statusMessage,
        parcelId: parcel.id,
      },
    });

    if (parcel.receiverEmail) {
      await this.sendItMailerService.sendEmail({
        to: parcel.receiverEmail,
        subject: `Parcel Status Update`,
        template: 'parcel-status-receiver',
        context: {
          receiverName: parcel.receiverName ?? 'Valued Customer',
          title: parcel.title,
          status: statusMessage,
          parcelId: parcel.id,
        },
      });
    }

    return updated;
  }

  async addTrackingEntry(parcelId: string, location: string, note?: string) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id: parcelId },
    });
    if (!parcel)
      throw new NotFoundException(`Parcel with ID ${parcelId} not found`);

    const trackingEntry = await this.prisma.parcelTrackingHistory.create({
      data: { parcelId, location, note },
    });

    await this.sendItMailerService.sendEmail({
      to: parcel.senderEmail,
      subject: `Parcel Tracking Update`,
      template: 'tracking-update-sender',
      context: {
        senderName: parcel.senderName ?? 'Valued Customer',
        title: parcel.title,
        location,
        note,
        parcelId: parcel.id,
      },
    });

    if (parcel.receiverEmail) {
      await this.sendItMailerService.sendEmail({
        to: parcel.receiverEmail,
        subject: 'Parcel tracking update',
        template: 'tracking-update-receiver',
        context: {
          receiverName: parcel.receiverName ?? 'Valued Customer',
          title: parcel.title,
          location,
          note,
          parcelId: parcel.id,
        },
      });
    }

    return trackingEntry;
  }

  async getParcelById(parcelId: string) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id: parcelId },
    });
  
    if (!parcel || parcel.isDeleted) {
      throw new NotFoundException(`Parcel with ID ${parcelId} not found or deleted`);
    }
  
    return parcel;
  }
  
}
