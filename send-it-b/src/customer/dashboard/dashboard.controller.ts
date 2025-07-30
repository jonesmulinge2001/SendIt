/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Query,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/auth/decorator/permissions.decorator';
import { PermissionGuard } from 'src/guards/permissions.guards';
import { Permission } from 'src/permissions/permission/permission.enum';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('sent')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @RequirePermissions(Permission.VIEW_OWN_PARCELS)
  async getSentParcels(@Query('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    const sent = await this.dashboardService.getSentParcels(email);
    if (!sent.length) throw new NotFoundException('No sent parcels found');
    return { statusCode: 200, data: sent };
  }

  @Get('received')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_OWN_PARCELS)
  async getReceivedParcels(@Query('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    const received = await this.dashboardService.getReceivedParcels(email);
    if (!received.length)
      throw new NotFoundException('No received parcels found');
    return { statusCode: 200, data: received };
  }

  @Get('pending-pickups')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_OWN_PARCELS)
  async getPendingPickups(@Query('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    const pending = await this.dashboardService.getPendingPickups(email);
    if (!pending.length)
      throw new NotFoundException('No pending pickups found');
    return { statusCode: 200, data: pending };
  }

  @Get('tracking-history')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_OWN_PARCELS)
  async getTrackingHistory(@Query('parcelId') parcelId: string) {
    if(!parcelId) {
        throw new BadRequestException('ParcelId is required');
    }
    const history = await this.dashboardService.getTrackingHistory(parcelId);
    if(!history.length) {
        throw new NotFoundException('No tracking history found');
    }
    return {
        statusCode: 200,
        data: history
    };
  }
}
