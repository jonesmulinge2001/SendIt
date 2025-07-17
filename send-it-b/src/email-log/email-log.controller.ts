/* eslint-disable prettier/prettier */
// src/email-log/email-log.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EmailLogService } from './email-log.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/guards/permissions.guards';
import { RequirePermissions } from 'src/auth/decorator/permissions.decorator';
import { Permission } from 'src/permissions/permission/permission.enum';

@Controller('admin/email-logs')
@UseGuards(AuthGuard('jwt'), PermissionGuard)
@RequirePermissions(Permission.MANAGE_EMAILS)
export class EmailLogController {
  constructor(private readonly emailLogService: EmailLogService) {}

  @Get()
  async getAll() {
    const logs = await this.emailLogService.getAllLogs();
    return {
      success: true,
      message: 'All email logs retrieved',
      data: logs,
    };
  }

  @Get('parcel/:parcelId')
  async getByParcel(@Param('parcelId') parcelId: string) {
    console.log('📦 Hitting getByParcel with:', parcelId);
  
    const logs = await this.emailLogService.getLogsByParcel(parcelId);
  
    if (!logs || logs.length === 0) {
      return {
        success: true,
        message: `No email logs found for parcel ${parcelId}`,
        data: [],
      };
    }
  
    return {
      success: true,
      message: `Logs for parcel ${parcelId}`,
      data: logs,
    };
  }
  
  @Get('recipient')
  async getByRecipient(@Query('email') email: string) {
    const logs = await this.emailLogService.getLogsByRecipient(email);
    return {
      success: true,
      message: `Logs sent to ${email}`,
      data: logs,
    };
  }
}
