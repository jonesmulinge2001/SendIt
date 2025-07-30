/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { SendItMailerService } from 'src/shared/mailer/mailer.service';
import { ParcelModule } from 'src/parcel/parcel.module';
import { PermissionModule } from 'src/permissions/permission/permission.module';

@Module({
  imports: [ParcelModule, PermissionModule],
  providers: [DriverService, SendItMailerService],
  controllers: [DriverController]
})
export class DriverModule {}
