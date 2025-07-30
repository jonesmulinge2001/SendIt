/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { RequestWithUser } from 'src/interfaces/request-with-user';
import { ParcelService } from 'src/parcel/parcel.service';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/auth/decorator/permissions.decorator';
import { PermissionGuard } from 'src/guards/permissions.guards';
import { Permission } from 'src/permissions/permission/permission.enum';
import { UpdateParcelStatusDto } from 'src/dto/update-parcel-status.dto';

@Controller('driver')
export class DriverController {
  constructor(
    private readonly parcelService: ParcelService,
    private readonly driverService: DriverService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.UPDATE_PARCEL_STATUS)
  async getMyParcels(@Req() req: RequestWithUser) {
    const driverId = req.user.id;
    return this.driverService.getParcelByDriver(driverId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.UPDATE_PARCEL_STATUS)
  async updateParcelStatus(
    @Param('id') id: string,
    @Body() dto: UpdateParcelStatusDto,
  ) {
    const updated = await this.parcelService.updateParcelStatus(id, dto.status);
    return {
      success: true,
      message: 'Parcel status updated successfully',
      data: updated,
    };
  }

  // ✅ 1. Add a new tracking entry
  @Post(':id/tracking')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_PARCELS)
  async addTracking(
    @Param('id') parcelId: string,
    @Body() body: { location: string; note?: string },
  ) {
    const { location, note } = body;
    const tracking = await this.parcelService.addTrackingEntry(
      parcelId,
      location,
      note,
    );
    return {
      success: true,
      message: 'Tracking entry added successfully',
      data: tracking,
    };
  }

  @Get('parcel/:id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_ASSIGNED_PARCELS)
  async getParcelById(@Param('id') id: string) {
    return this.driverService.getParcelById(id);
  }
}
