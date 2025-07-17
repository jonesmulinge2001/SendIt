/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
// src/parcel/parcel.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { CreateParcelDto } from 'src/dto/create-percel.dto';
import { UpdateParcelDto } from 'src/dto/update-percel.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/auth/decorator/permissions.decorator';
import { PermissionGuard } from 'src/guards/permissions.guards';
import { Permission } from 'src/permissions/permission/permission.enum';
import { UpdateParcelStatusDto } from 'src/dto/update-parcel-status.dto';

@Controller('admin/parcels')
export class ParcelController {
  constructor(private readonly parcelService: ParcelService) {}

  // 1. Create a new parcel
  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.CREATE_PARCEL)
  async createParcel(@Body() dto: CreateParcelDto) {
    const result = await this.parcelService.createParcel(dto);
    return {
      success: true,
      message: 'Parcel created successfully',
      data: result,
    };
  }

  // 2. Get all parcels
  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_PARCELS)
  async getAllParcels() {
    const parcels = await this.parcelService.getAllParcels();
    return {
      success: true,
      data: parcels,
    };
  }

  // 3. Update parcel (any field)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.UPDATE_PARCEL_STATUS)
  async updateParcel(@Param('id') id: string, @Body() dto: UpdateParcelDto) {
    const updated = await this.parcelService.updateParcel(id, dto);
    return {
      success: true,
      message: 'Parcel updated successfully',
      data: updated,
    };
  }

  // 4. Soft delete parcel
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.UPDATE_PARCEL_STATUS)
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDeleteParcel(@Param('id') id: string) {
    await this.parcelService.softDeleteParcel(id);
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

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.UPDATE_PARCEL_STATUS)
  async getParcelStats() {
    const stats = await this.parcelService.getParcelStats();

    return {
      success: true,
      message: 'Parcel statistics fetched successfully',
      data: stats,
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

  // ✅ 2. Get tracking history for a parcel
  @Get(':id/tracking')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_PARCELS)
  async getTracking(@Param('id') parcelId: string) {
    const history = await this.parcelService.getTrackingHistory(parcelId);
    return {
      success: true,
      message: `Tracking history for parcel ${parcelId}`,
      data: history,
    };
  }

  // ✅ 3. Get all tracking entries (optional)
  @Get('tracking/all')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_PARCELS)
  async getAllTracking() {
    const allTracking = await this.parcelService.getAllTracking();
    return {
      success: true,
      message: 'All tracking history entries',
      data: allTracking,
    };
  }

  @Get('trends')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_PARCELS)
  getTrends() {
    return this.parcelService.getParcelTrends();
  }

  @Get(':id')
  async getParcelById(@Param('id') id: string) {
    return this.parcelService.getParcelById(id);
  }
}
