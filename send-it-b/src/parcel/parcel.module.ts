/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';
import { SendItMailerService } from 'src/shared/mailer/mailer.service';
import { PermissionGuard } from 'src/guards/permissions.guards';
import { PermissionModule } from 'src/permissions/permission/permission.module';

@Module({
  imports: [
    PermissionModule
  ],
  controllers: [ParcelController],
  providers: [ParcelService, SendItMailerService, PermissionGuard],
  exports: [ParcelService]
})
export class ParcelModule {}
