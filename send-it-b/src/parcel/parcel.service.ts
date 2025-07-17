/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
import { SendItMailerService } from './../shared/mailer/mailer.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ParcelStatus, PrismaClient } from 'generated/prisma';
import { CreateParcelDto } from 'src/dto/create-percel.dto';
import { UpdateParcelDto } from 'src/dto/update-percel.dto';
import { subWeeks, startOfWeek } from 'date-fns';

@Injectable()
export class ParcelService {
  private prisma = new PrismaClient();

  constructor(private readonly sendItMailerService: SendItMailerService) {}

  async createParcel(dto: CreateParcelDto) {
    const parcel = await this.prisma.parcel.create({
      data: {
        title: dto.title,
        description: dto.description,
        weightKg: dto.weightKg,
        pickupAddress: dto.pickupAddress,
        destination: dto.destination,
        senderName: dto.senderName,
        senderEmail: dto.senderEmail,
        receiverName: dto.receiverName,
        receiverEmail: dto.receiverEmail,
      },
    });

    // notify sender
    await this.sendItMailerService.sendEmail({
      to: parcel.senderEmail,
      subject: '📦 Parcel Created Successfully',
      template: 'parcel-created',
      context: {
        senderName: parcel.senderName,
        title: parcel.title,
        destination: parcel.destination,
        parcelId: parcel.id,
      },
    });

    // notify receiver
    if (parcel.receiverEmail) {
      await this.sendItMailerService.sendEmail({
        to: parcel.receiverEmail,
        subject: '📬 Incoming Parcel Notification',
        template: 'parcel-incoming',
        context: {
          receiverName: parcel.receiverName ?? 'Valued Customer',
          title: parcel.title,
          pickupAddress: parcel.pickupAddress,
          parcelId: parcel.id,
        },
      });
    }

    return parcel;
  }

  async getAllParcels() {
    return this.prisma.parcel.findMany({
      where: { isDeleted: false },
    });
  }

  async updateParcel(id: string, dto: UpdateParcelDto) {
    const existing = await this.prisma.parcel.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) throw new NotFoundException(`Parcel with ID ${id} not found or deleted`);
    return this.prisma.parcel.update({
      where: { id },
      data: { ...dto },
    });
  }

  async softDeleteParcel(id: string) {
    const existing = await this.prisma.parcel.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) throw new NotFoundException(`Parcel with ID ${id} not found or already deleted`);
    return this.prisma.parcel.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async updateParcelStatus(id: string, status: ParcelStatus) {
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel || parcel.isDeleted) throw new NotFoundException(`Parcel with ID ${id} not found or deleted`);

    const updated = await this.prisma.parcel.update({
      where: { id },
      data: { status },
    });

    const statusMessage = {
      PENDING: 'Your parcel is pending.',
      IN_TRANSIT: 'Your parcel is now in transit.',
      DELIVERED: 'Your parcel has been delivered!',
      CANCELLED: 'Your parcel was cancelled.',
    }[status] || 'Parcel status updated.';

    await this.addTrackingEntry(parcel.id, 'SYSTEM', statusMessage);

    await this.sendItMailerService.sendEmail({
      to: parcel.senderEmail,
      subject: `📦 Parcel Status Updated`,
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
        subject: `📦 Parcel Status Update`,
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
    const parcel = await this.prisma.parcel.findUnique({ where: { id: parcelId } });
    if (!parcel) throw new NotFoundException(`Parcel with ID ${parcelId} not found`);

    const trackingEntry = await this.prisma.parcelTrackingHistory.create({
      data: { parcelId, location, note },
    });

    await this.sendItMailerService.sendEmail({
      to: parcel.senderEmail,
      subject: `Parcel Tracking Update`,
      template: 'tracking-update-sender',
      context: {
        receiverName: parcel.receiverName ?? 'Valued Customer',
        title: parcel.title,
        location,
        note,
        parcelId: parcel.id
      }
    });

    if(parcel.receiverEmail){
      await this.sendItMailerService.sendEmail({
        to: parcel.receiverEmail,
        subject:'Parcel tracking update',
        template: 'tracking-update-receiver',
        context: {
          receiverName: parcel.receiverName ?? 'Valued Customer',
          title: parcel.title,
          location,
          note,
          parcelId: parcel.id
        }
      });
    }

    return trackingEntry;

  }



  async getParcelStats() {
    const counts = await Promise.all([
      this.prisma.parcel.count({ where: { isDeleted: false } }),
      this.prisma.parcel.count({ where: { isDeleted: false, status: 'PENDING' } }),
      this.prisma.parcel.count({ where: { isDeleted: false, status: 'IN_TRANSIT' } }),
      this.prisma.parcel.count({ where: { isDeleted: false, status: 'DELIVERED' } }),
      this.prisma.parcel.count({ where: { isDeleted: false, status: 'CANCELLED' } }),
    ]);

    return {
      total: counts[0],
      pending: counts[1],
      inTransit: counts[2],
      delivered: counts[3],
      cancelled: counts[4],
    };
  }

  async getTrackingHistory(parcelId: string) {
    const parcel = await this.prisma.parcel.findUnique({ where: { id: parcelId } });
    if (!parcel) throw new NotFoundException(`Parcel with ID ${parcelId} not found`);

    return this.prisma.parcelTrackingHistory.findMany({
      where: { parcelId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getAllTracking() {
    return this.prisma.parcelTrackingHistory.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }

  async getParcelTrends() {
    const weeks: { week: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = startOfWeek(subWeeks(new Date(), i));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const count = await this.prisma.parcel.count({
        where: { createdAt: { gte: start, lte: end }, isDeleted: false },
      });
      weeks.push({
        week: `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`,
        count,
      });
    }
    return weeks;
  }
}
