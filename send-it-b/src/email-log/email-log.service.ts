/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class EmailLogService {
  private prisma = new PrismaClient();

  async getAllLogs() {
    return this.prisma.emailNotification.findMany({
      orderBy: { sentAt: 'desc' },
    });
  }

  async getLogsByParcel(parcelId: string) {
    const logs = await this.prisma.emailNotification.findMany({
      where: {
        parcelId,
      },
      orderBy: {
        sentAt: 'desc',
      },
    });
  
    return logs;
  }
  

  async getLogsByRecipient(email: string) {
    return this.prisma.emailNotification.findMany({
      where: { toEmail: email },
      orderBy: { sentAt: 'desc' },
    });
  }
}
